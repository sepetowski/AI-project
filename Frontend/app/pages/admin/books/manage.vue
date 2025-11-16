<script setup lang="ts">
import { Role } from '~~/enums/roles';
import EmptyState from '~/components/shared/EmptyState.vue';
import BooksManage from '~/components/tables/BooksManage.vue';
import type { BooksRes } from '~~/types/Book';

definePageMeta({ role: Role.Admin });

const { data, refresh } = await useServerFetch<BooksRes>('/books');
</script>

<template>
	<div v-if="data && data.amount > 0">
		<BooksManage :data="data" />
	</div>

	<div v-else>
		<EmptyState
			title="No books"
			description="Try adding a new book or refreshing the page."
			:on-refresh="refresh"
			icon="i-heroicons-book-open"
		/>
	</div>
</template>
