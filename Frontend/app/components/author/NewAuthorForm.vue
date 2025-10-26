<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { newAuthorSchema } from '../../../schemas/authors/newAuthor';
import { useClientFetch } from '#imports';
import type { NewAuthorSchema } from '../../../schemas/authors/newAuthor';
import type { FormSubmitEvent } from '@nuxt/ui';

const isMounted = ref(false);
const loading = ref(false);

const formData = reactive<Partial<NewAuthorSchema>>({
	name: '',
	surname: '',
	description: '',
	dateOfBirth: undefined,
});

const isValid = computed(() => newAuthorSchema.safeParse(formData).success);

onMounted(() => {
	isMounted.value = true;
});

const resetForm = () => {
	formData.name = '';
	formData.surname = '';
	formData.description = '';
	formData.dateOfBirth = undefined;
};

const onSubmit = async (event: FormSubmitEvent<typeof formData>) => {
	loading.value = true;

	const { error } = await useClientFetch('/authors', {
		method: 'POST',
		body: {
			name: event.data.name,
			surname: event.data.surname,
			description: event.data.description,
			dateOfBirth: event.data.dateOfBirth || null,
		},
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title: 'Author was added',
				desc: `${event.data.name} ${event.data.surname}`,
			},
		},
	});

	if (!error.value) resetForm();

	loading.value = false;
};
</script>

<template>
	<UForm
		ref="form"
		:schema="newAuthorSchema"
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
			Create Author
		</UButton>
	</UForm>
</template>
