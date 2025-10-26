<script setup lang="ts">
definePageMeta({ public: true });
</script>

<template>
	<UContainer class="h-screen flex items-center justify-center">
		<div class="flex flex-col items-center justify-center space-y-6">
			<h1 class="text-9xl font-bold text-primary">404</h1>
			<p class="text-lg mt-6 text-gray-500 dark:text-gray-400">
				The page you are looking for does not exist.
			</p>
			<UButton class="mt-2" to="/" color="primary" size="lg" icon="i-heroicons-home-20-solid">
				Go back home
			</UButton>
		</div>
	</UContainer>
</template>
