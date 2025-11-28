<script setup lang="ts">
import BooksDetails from '~/components/cards/BooksDetails.vue';
import type { BookDetails } from '~~/types/Book';

const route = useRoute();
const id = route.params.id;
const { data, refresh } = await useServerFetch<BookDetails>(`/books/${id}`);
if (!data.value) await navigateTo('/not-found', { replace: true });
</script>

<template>
	<BooksDetails v-if="data" :book="data" @refresh="refresh" />
</template>
