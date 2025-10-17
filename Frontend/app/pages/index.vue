<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const handleAuthQuery = (query: Record<string, any>) => {
	if (query.new && query.username) {
		const title =
			query.new === 'true'
				? `Welcome on board ${query.username}`
				: `Welcome back ${query.username}`;
		const description =
			query.new === 'true' ? 'You have been registered' : 'You have been logged in';

		toast.clear();
		toast.add({
			title,
			description,
			color: 'success',
			icon: 'i-heroicons-check-circle',
		});

		setTimeout(() => {
			router.replace({ query: {} });
		}, 300);
	}
};

onMounted(() => {
	handleAuthQuery(route.query as any);
});

const doTest = async () => {
	try {
		const result = await $fetch('/api/books/all', { method: 'GET' });
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
