<script setup lang="ts">
import { useAuthGreeting } from '@/composables/useAuthGreeting';
const { data, pending, error } = await useApiFetch('/books');

useAuthGreeting();
</script>

<template>
	<div>
		<p v-if="pending">Ładowanie danych...</p>
		<p v-else-if="error">Błąd: {{ error.message }}</p>
	</div>
</template>
