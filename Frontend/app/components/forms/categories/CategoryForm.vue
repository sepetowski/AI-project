<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { categorySchema } from '../../../../schemas/category/category';
import { useClientFetch } from '#imports';
import type { CategorySchema } from '../../../../schemas/category/category';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { Category } from '../../../../types/Category';

const { initialData, isEdit } = defineProps<{
	initialData?: Category;
	isEdit?: boolean;
}>();
const isMounted = ref(false);
const loading = ref(false);

const formData = reactive<Partial<CategorySchema>>({
	name: '',
});

const isValid = computed(() => categorySchema.safeParse(formData).success);

onMounted(() => {
	isMounted.value = true;
});

watch(
	() => initialData,
	(newVal) => {
		if (newVal) {
			formData.name = newVal.name ?? '';
		}
	},
	{ immediate: true }
);
const resetForm = () => {
	formData.name = '';
};

const onSubmit = async (event: FormSubmitEvent<typeof formData>) => {
	loading.value = true;
	const path = isEdit ? `/categories/${initialData?.id}` : '/categories';
	const title = isEdit ? 'Category was edited' : 'Category was added';

	const { error } = await useClientFetch(path, {
		method: isEdit ? 'PUT' : 'POST',
		body: {
			name: event.data.name,
		},
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title,
				desc: `${event.data.name}`,
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
						{{ isEdit ? `Edit Category` : 'Add new category' }}
					</h1>
				</div>
			</template>

			<UForm
				ref="form"
				:schema="categorySchema"
				:state="formData"
				:disabled="!isMounted"
				class="space-y-3 w-full"
				@submit="onSubmit"
			>
				<UFormField label="Name" name="name">
					<UInput
						v-model="formData.name"
						class="w-full"
						placeholder="Enter category's name"
						icon="i-heroicons-user"
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
					{{ isEdit ? 'Edit category' : 'Create category' }}
				</UButton>
			</UForm>
		</UCard>
	</UContainer>
</template>
