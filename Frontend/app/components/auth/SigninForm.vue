<script setup lang="ts">
import { reactive } from 'vue';
import { signinSchema } from '../../../schemas/auth/signin';
import type { SigninSchema } from '../../../schemas/auth/signin';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { ApiError } from '~~/types/apiError';

const { signIn } = useAuth();

const toast = useToast();
const showPassword = ref(false);
const isMounted = ref(false);
const isValid = computed(() => signinSchema.safeParse(formData).success);

onMounted(() => {
	isMounted.value = true;
});

const formData = reactive<Partial<SigninSchema>>({
	username: '',
	password: '',
});

const onSubmit = async (event: FormSubmitEvent<typeof formData>) => {
	try {
		await signIn(
			{
				provider: 'local',
				payload: {
					...event.data,
				},
			},
			{
				external: true,
				callbackUrl: `http://localhost:3000/?new=false&&username=${event.data.username}`,
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
	<UForm
		:schema="signinSchema"
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

		<UButton
			:disabled="!isValid"
			type="submit"
			class="cursor-pointer mt-4"
			icon="i-heroicons-user-plus"
			block
		>
			Login
		</UButton>
	</UForm>
</template>
