<script setup lang="ts">
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
