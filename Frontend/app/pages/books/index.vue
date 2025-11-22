<script setup lang="ts">
import { useAuthGreeting } from '@/composables/useAuthGreeting';
import BookList from '~/components/lists/BookList.vue';
import type { BooksRes } from '~~/types/Book';
const { data, refresh } = await useServerFetch<BooksRes>('/books');

useAuthGreeting();
</script>

<template>
	<div v-if="data && data.amount > 0">
		<BookList :books="data.books" />
	</div>

	<div v-else>
		<EmptyState
			title="No books"
			description="There are no books. Try to refresh"
			:on-refresh="refresh"
			icon="i-heroicons-book-open"
		/>
	</div>
</template>
