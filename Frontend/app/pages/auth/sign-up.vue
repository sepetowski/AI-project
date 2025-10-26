<script setup lang="ts">
import SignupForm from '~/components/auth/SignupForm.vue';

definePageMeta({ guestOnly: true });
</script>

<template>
	<UContainer class="min-h-screen flex items-center justify-center">
		<UCard class="w-full max-w-md">
			<template #header>
				<div class="text-center space-y-1">
					<h1 class="text-2xl font-semibold">Create your account</h1>
					<p class="text-sm text-gray-500">Sign up to get started</p>
				</div>
			</template>

			<SignupForm />

			<template #footer>
				<div class="text-center text-sm">
					Already have an account?
					<NuxtLink to="/auth/sign-in" class="text-primary-600 hover:underline">Log in</NuxtLink>
				</div>
			</template>
		</UCard>
	</UContainer>
</template>
