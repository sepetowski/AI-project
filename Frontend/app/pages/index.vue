<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const toast = useToast();

watch(
	() => route.query,
	async (query) => {
		if (query.new === 'true' && query.username) {
			toast.clear();
			toast.add({
				title: `Welcome on board ${query.username}`,
				description: 'You have been registered',
				color: 'success',
				icon: 'i-heroicons-check-circle',
			});
			await new Promise((resolve) => setTimeout(resolve, 300));
			router.replace({ query: {} });
		}
	},
	{ immediate: true }
);

const doTest = async () => {
	try {
		const result = await $fetch('/api/books/all', {
			method: 'GET',
		});

		console.log(result);
	} catch (e: any) {
		console.error('Błąd:', e);
	}
};
</script>

<template>
	<div>
		<UButton @click="doTest">Test</UButton>
	</div>
</template>
