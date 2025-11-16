<script setup lang="ts">
import SigninForm from '~/components/forms/auth/SigninForm.vue';

definePageMeta({ guestOnly: true });
</script>

<template>
	<UContainer class="min-h-screen flex items-center justify-center">
		<UCard class="w-full max-w-md">
			<template #header>
				<div class="text-center space-y-1">
					<h1 class="text-2xl font-semibold">Welcome back!</h1>
				</div>
			</template>

			<SigninForm />

			<template #footer>
				<div class="text-center text-sm">
					Don't have an account?
					<NuxtLink to="/auth/sign-up" class="text-primary-600 hover:underline"
						>Create new</NuxtLink
					>
				</div>
			</template>
		</UCard>
	</UContainer>
</template>
