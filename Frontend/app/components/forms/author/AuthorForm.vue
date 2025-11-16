<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { authorSchema } from '../../../../schemas/authors/author';
import { useClientFetch } from '#imports';
import type { AuthorSchema } from '../../../../schemas/authors/author';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { Author } from '../../../../types/Author';

const { initialData, isEdit } = defineProps<{
	initialData?: Author;
	isEdit?: boolean;
}>();

const isMounted = ref(false);
const loading = ref(false);

const formData = reactive<Partial<AuthorSchema>>({
	name: '',
	surname: '',
	description: '',
	dateOfBirth: undefined,
});

const isValid = computed(() => authorSchema.safeParse(formData).success);

onMounted(() => {
	isMounted.value = true;
});

const resetForm = () => {
	formData.name = '';
	formData.surname = '';
	formData.description = '';
	formData.dateOfBirth = undefined;
};

watch(
	() => initialData,
	(newVal) => {
		if (newVal) {
			formData.name = newVal.name ?? '';
			formData.surname = newVal.surname ?? '';
			formData.description = newVal.description ?? '';
			formData.dateOfBirth = newVal.dateOfBirth ?? undefined;
		} else {
			resetForm();
		}
	},
	{ immediate: true }
);

const onSubmit = async (event: FormSubmitEvent<typeof formData>) => {
	loading.value = true;
	const path = isEdit ? `/authors/${initialData?.id}` : '/authors';
	const title = isEdit ? 'Author was edited' : 'Author was added';

	const { error } = await useClientFetch(path, {
		method: isEdit ? 'PUT' : 'POST',
		body: {
			name: event.data.name,
			surname: event.data.surname,
			description: event.data.description,
			dateOfBirth: event.data.dateOfBirth || null,
		},
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title,
				desc: `${event.data.name} ${event.data.surname}`,
			},
		},
	});

	if (!error.value && !isEdit) resetForm();

	loading.value = false;
};
</script>

<template>
	<UContainer class="min-h-screen flex items-center justify-center">
		<UCard class="w-full max-w-md">
			<template #header>
				<div class="text-center space-y-1">
					<h1 class="text-2xl font-semibold">
						{{ isEdit ? `Edit Author` : 'Add new Author' }}
					</h1>
				</div>
			</template>

			<UForm
				ref="form"
				:schema="authorSchema"
				:state="formData"
				:disabled="!isMounted"
				class="space-y-3 w-full"
				@submit="onSubmit"
			>
				<UFormField label="Name" name="name">
					<UInput
						v-model="formData.name"
						class="w-full"
						placeholder="Enter author's name"
						icon="i-heroicons-user"
					/>
				</UFormField>

				<UFormField label="Surname" name="surname">
					<UInput
						v-model="formData.surname"
						class="w-full"
						placeholder="Enter author's surname"
						icon="i-heroicons-identification"
					/>
				</UFormField>

				<UFormField label="Description" name="description">
					<UTextarea
						v-model="formData.description"
						class="w-full"
						placeholder="Short bio (optional)"
						:rows="7"
					/>
				</UFormField>

				<UFormField label="Date of Birth" name="dateOfBirth">
					<UInput
						v-model="formData.dateOfBirth"
						class="w-full"
						type="date"
						icon="i-heroicons-calendar"
					/>
				</UFormField>

				<UButton
					type="submit"
					block
					class="cursor-pointer mt-4"
					icon="i-heroicons-plus"
					:loading="loading"
					:disabled="!isValid"
				>
					{{ isEdit ? 'Edit Author' : 'Create Author' }}
				</UButton>
			</UForm>
		</UCard>
	</UContainer>
</template>
