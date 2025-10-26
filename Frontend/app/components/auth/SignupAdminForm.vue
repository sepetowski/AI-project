<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { signupSchema } from '../../../schemas/auth/signup';
import type { SignupSchema } from '../../../schemas/auth/signup';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { ApiError } from '~~/types/apiError';
import { Role } from '~~/enums/roles';

const { signUp } = useAuth();
const toast = useToast();
const loading = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);
const showKey = ref(false);
const isMounted = ref(false);
const formData = reactive<Partial<SignupSchema>>({
	username: '',
	email: '',
	password: '',
	role: Role.Admin,
	adminRoleKey: '',
	confirmPassword: '',
});
const isValid = computed(() => signupSchema.safeParse(formData).success);

onMounted(() => {
	isMounted.value = true;
});

const onSubmit = async (event: FormSubmitEvent<typeof formData>) => {
	try {
		loading.value = true;
		await signUp(
			{
				provider: 'local',
				payload: { ...event.data },
			},
			{
				external: true,
				callbackUrl: `/books?new=true&&username=${event.data.username}`,
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
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<UForm
		:schema="signupSchema"
		:state="formData"
		:disabled="!isMounted"
		class="space-y-2 w-full"
		@submit="onSubmit"
	>
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

		<UFormField label="Admin Key" name="adminRoleKey">
			<UInput
				class="w-full"
				v-model="formData.adminRoleKey"
				:type="showKey ? 'text' : 'password'"
				placeholder="••••••••"
				icon="i-heroicons-lock-closed"
				:trailing="true"
			>
				<template #trailing>
					<UButton
						class="cursor-pointer"
						variant="link"
						:icon="showKey ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
						@click.prevent="showKey = !showKey"
					/>
				</template>
			</UInput>
		</UFormField>

		<UButton
			:loading="loading"
			:disabled="!isValid"
			type="submit"
			class="cursor-pointer mt-4"
			icon="i-heroicons-user-plus"
			block
		>
			Create Admin account
		</UButton>
	</UForm>
</template>
