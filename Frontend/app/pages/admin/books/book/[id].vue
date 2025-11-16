<script setup lang="ts">
import BookForm from '~/components/forms/book/BookForm.vue';
import { Role } from '~~/enums/roles';
import type { BookDetails } from '~~/types/Book';
definePageMeta({ role: Role.Admin });

const route = useRoute();
const id = route.params.id;
const { data } = await useServerFetch<BookDetails>(`/books/${id}`);
if (!data.value) await navigateTo('/not-found', { replace: true });
</script>

<template>
	<BookForm :is-edit="true" :initial-data="data" />
</template>
