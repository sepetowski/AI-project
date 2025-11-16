<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from 'vue';
import type { FormSubmitEvent } from '@nuxt/ui';
import { useClientFetch } from '#imports';
import { bookSchema } from '../../../../schemas/books/book';
import type { BookSchema } from '../../../../schemas/books/book';
import type { AuthorsRes } from '~~/types/Author';
import type { CategoriesRes } from '~~/types/Category';
import type { BookDetails } from '~~/types/Book';

const { initialData, isEdit } = defineProps<{
	initialData?: BookDetails;
	isEdit?: boolean;
}>();

const MAX_IMAGE_MB = 5;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const isMounted = ref(false);
const loading = ref(false);
const imageError = ref<string | null>(null);
const previewUrl = ref<string | null>(null);

const formData = reactive({
	authorId: '' as string,
	bookDescripton: '' as string,
	title: '' as string,
	numberOfPage: '' as string | number,
	publicationDate: '' as string,
	imageFile: null as File | null,
	availableCopies: '' as string | number,
	categoriesIds: [] as string[],
});

type Option = { label: string; value: string };
const authorOptions = ref<Option[]>([]);
const categoryOptions = ref<Option[]>([]);
const removeExistingImage = ref(false);

const fetchAuthors = async () => {
	const { data } = await useClientFetch<AuthorsRes>('/authors');

	if (data.value) {
		authorOptions.value = data.value.authors.map((a) => ({
			label: `${a.name} ${a.surname}`,
			value: a.id,
		}));
	}
};

const fetchCategories = async () => {
	const { data } = await useClientFetch<CategoriesRes>('/categories');

	console.log(data.value);
	if (data.value)
		categoryOptions.value = data.value.categories.map((c) => ({
			label: c.name,
			value: c.id,
		}));
};

onMounted(async () => {
	await Promise.all([fetchAuthors(), fetchCategories()]);
	isMounted.value = true;
});

watch(
	() => initialData,
	(newVal) => {
		if (!newVal) return;

		formData.authorId = newVal.authorId;
		formData.title = newVal.title;
		formData.bookDescripton = newVal.bookDescripton;
		formData.numberOfPage = newVal.numberOfPage;
		formData.availableCopies = newVal.availableCopies ?? '';
		formData.categoriesIds = (newVal.categories ?? []).map((c) => c.id);

		if (newVal.publicationDate) {
			formData.publicationDate = newVal.publicationDate.split('T')[0] ?? '';
		} else {
			formData.publicationDate = '';
		}

		if (newVal.imageUrl) {
			previewUrl.value = newVal.imageUrl;
			removeExistingImage.value = false;
		}
	},
	{ immediate: true }
);

const toIsoDate = (val: string) => {
	if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
	const parts = val.split('.');
	if (parts.length === 3) {
		const [day, month, year] = parts;
		return `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`;
	}
	return '';
};
const validationState = computed<BookSchema>(() => ({
	authorId: formData.authorId,
	bookDescripton: formData.bookDescripton,
	title: formData.title,
	numberOfPage:
		typeof formData.numberOfPage === 'string'
			? Number(formData.numberOfPage)
			: (formData.numberOfPage as number),

	publicationDate: toIsoDate(formData.publicationDate),
	imageFile: formData.imageFile ?? undefined,
	availableCopies:
		typeof formData.availableCopies === 'string'
			? Number(formData.availableCopies)
			: (formData.availableCopies as number),
	categoriesIds: formData.categoriesIds.length ? formData.categoriesIds : undefined,
}));

const isValid = computed(() => bookSchema.safeParse(validationState.value).success);

const resetForm = () => {
	formData.authorId = '';
	formData.bookDescripton = '';
	formData.title = '';
	formData.numberOfPage = '';
	formData.publicationDate = '';
	formData.imageFile = null;
	formData.availableCopies = '';
	formData.categoriesIds = [];
};

watch(
	() => formData.imageFile,
	(file) => {
		if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
		previewUrl.value = file ? URL.createObjectURL(file) : null;
	}
);

onBeforeUnmount(() => {
	if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});

const onFileChange = (e: Event) => {
	const input = e.target as HTMLInputElement;
	const file = input.files?.[0] ?? null;
	imageError.value = null;

	if (!file) {
		formData.imageFile = null;
		return;
	}

	if (!ALLOWED_MIME.includes(file.type)) {
		imageError.value = 'Allowed types: JPG, PNG, WEBP, GIF';
		formData.imageFile = null;
		input.value = '';
		return;
	}

	const sizeMb = file.size / (1024 * 1024);
	if (sizeMb > MAX_IMAGE_MB) {
		imageError.value = `Max size ${MAX_IMAGE_MB} MB`;
		formData.imageFile = null;
		input.value = '';
		return;
	}

	formData.imageFile = file;
};

const clearImage = () => {
	formData.imageFile = null;
	imageError.value = null;
	if (previewUrl.value) {
		URL.revokeObjectURL(previewUrl.value);
	}
	previewUrl.value = null;
	removeExistingImage.value = true;
};
const onSubmit = async (event: FormSubmitEvent<BookSchema>) => {
	loading.value = true;
	const path = isEdit ? '/books/updateBook' : '/books/addBook';
	const title = isEdit ? 'Book was edited' : 'Book was added';

	const fd = new FormData();
	if (isEdit) fd.append('Id', initialData?.id ?? '');

	fd.append('AuthorId', event.data.authorId);
	fd.append('Title', event.data.title);
	fd.append('BookDescripton', event.data.bookDescripton);
	fd.append('NumberOfPage', String(event.data.numberOfPage));
	fd.append('PublicationDate', event.data.publicationDate);
	fd.append('AvailableCopies', String(event.data.availableCopies));
	for (const id of event.data.categoriesIds ?? []) fd.append('CategoriesIds', id);

	if (formData.imageFile) {
		fd.append('ImageFile', formData.imageFile);
	} else if (isEdit && removeExistingImage.value) {
		fd.append('DeleteFile', 'true');
	}

	const { error } = await useClientFetch(path, {
		method: 'POST',
		body: fd,
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title,
				desc: `${event.data.title}`,
			},
		},
	});

	if (!error.value && !isEdit) resetForm();

	loading.value = false;
};
</script>

<template>
	<UContainer class="min-h-screen flex items-center justify-center">
		<UCard class="w-full max-w-2xl">
			<template #header>
				<div class="text-center space-y-1">
					<h1 class="text-2xl font-semibold">
						{{ isEdit ? 'Edit Book' : 'Add new book' }}
					</h1>
				</div>
			</template>

			<UForm
				:schema="bookSchema"
				:state="validationState"
				:disabled="!isMounted"
				class="space-y-4"
				@submit="onSubmit"
			>
				<UFormField label="Author" name="authorId">
					<USelectMenu
						v-model="formData.authorId"
						:loading="!isMounted"
						virtualize
						:items="authorOptions"
						value-key="value"
						searchable
						placeholder="Select an author"
						class="w-full"
					/>
				</UFormField>

				<UFormField label="Title" name="title">
					<UInput
						v-model="formData.title"
						class="w-full"
						placeholder="Enter book title"
						icon="i-heroicons-book-open"
					/>
				</UFormField>

				<UFormField label="Description" name="bookDescripton">
					<UTextarea
						v-model="formData.bookDescripton"
						placeholder="Short description of the book"
						:rows="4"
						class="w-full"
					/>
				</UFormField>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<UFormField label="Number of pages" name="numberOfPage">
						<UInput
							v-model="formData.numberOfPage"
							type="number"
							:min="1"
							:max="5000"
							placeholder="e.g. 320"
							class="w-full"
						/>
					</UFormField>

					<UFormField label="Publication date" name="publicationDate">
						<UInput v-model="formData.publicationDate" type="date" class="w-full" />
					</UFormField>

					<UFormField label="Available copies" name="availableCopies">
						<UInput
							v-model="formData.availableCopies"
							type="number"
							:min="0"
							:max="100"
							placeholder="e.g. 10"
							class="w-full"
						/>
					</UFormField>
				</div>

				<UFormField label="Categories" name="categoriesIds">
					<USelectMenu
						v-model="formData.categoriesIds"
						virtualize
						:loading="!isMounted"
						:items="categoryOptions"
						value-key="value"
						multiple
						searchable
						placeholder="Pick categories"
						class="w-full"
					/>
				</UFormField>

				<UFormField label="Cover image" name="imageFile">
					<UInput type="file" accept="image/*" @change="onFileChange" />
					<p v-if="imageError" class="text-red-500 text-sm mt-1">{{ imageError }}</p>

					<div v-if="previewUrl" class="mt-2 flex items-center gap-2">
						<img :src="previewUrl" alt="Preview" class="h-24 w-24 object-cover rounded" />
						<UButton size="xs" variant="soft" @click="clearImage">Remove</UButton>
					</div>
				</UFormField>

				<UButton
					type="submit"
					block
					class="cursor-pointer mt-2"
					icon="i-heroicons-plus"
					:loading="loading"
					:disabled="!isValid"
				>
					{{ isEdit ? 'Update book' : 'Create book' }}
				</UButton>
			</UForm>
		</UCard>
	</UContainer>
</template>
