<script setup lang="ts">
import { reactive } from 'vue';
import { signupSchema } from '~~/schemas/signup';
import type { SignupSchema } from '~~/schemas/signup';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { ApiError } from '~~/types/apiError';

const { signUp } = useAuth();

const toast = useToast();
const showPassword = ref(false);
const showConfirm = ref(false);

const formData = reactive<Partial<SignupSchema>>({
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
});

const onSubmit = async (event: FormSubmitEvent<typeof formData>) => {
	try {
		await signUp(
			{
				provider: 'local',
				payload: {
					...event.data,
				},
			},
			{
				external: true,
				callbackUrl: `http://localhost:3000/?new=true&&username=${event.data.username}`,
			}
		);
	} catch (error: unknown) {
		const e = error as ApiError;
		const msg = e?.data?.message ?? 'Something went wrong';

		toast.add({
			title: 'Oops!',
			description: msg,
			color: 'error',
			icon: 'i-heroicons-x-circle',
		});
	}
};
</script>

<template>
	<UForm :schema="signupSchema" :state="formData" class="space-y-2 w-full" @submit="onSubmit">
		<UFormField label="Username" name="username">
			<UInput
				class="w-full"
				v-model="formData.username"
				placeholder="your name"
				icon="i-heroicons-user"
			/>
		</UFormField>

		<UFormField label="Email" name="email">
			<UInput
				class="w-full"
				v-model="formData.email"
				placeholder="you@example.com"
				icon="i-heroicons-envelope"
			/>
		</UFormField>

		<UFormField label="Password" name="password">
			<UInput
				class="w-full"
				v-model="formData.password"
				:type="showPassword ? 'text' : 'password'"
				placeholder="••••••••"
				icon="i-heroicons-lock-closed"
				:trailing="true"
			>
				<template #trailing>
					<UButton
						class="cursor-pointer"
						variant="link"
						:icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
						@click.prevent="showPassword = !showPassword"
					/>
				</template>
			</UInput>
		</UFormField>

		<UFormField label="Confirm password" name="confirmPassword">
			<UInput
				class="w-full"
				v-model="formData.confirmPassword"
				:type="showConfirm ? 'text' : 'password'"
				placeholder="••••••••"
				icon="i-heroicons-lock-closed"
				:trailing="true"
			>
				<template #trailing>
					<UButton
						class="cursor-pointer"
						variant="link"
						:icon="showConfirm ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
						@click.prevent="showConfirm = !showConfirm"
					/>
				</template>
			</UInput>
		</UFormField>

		<UButton type="submit" class="cursor-pointer mt-4" icon="i-heroicons-user-plus" block>
			Create account
		</UButton>
	</UForm>
</template>
