<script setup lang="ts">
import { useAuthGreeting } from '@/composables/useAuthGreeting';
import type { AuthorsRes } from '~~/types/Author';
import AuthorList from '~/components/lists/AuthorList.vue';
const { data, refresh } = await useServerFetch<AuthorsRes>('/authors');

useAuthGreeting();
</script>

<template>
	<div v-if="data && data.amount > 0">
		<AuthorList :authors="data.authors" />
	</div>

	<div v-else>
		<EmptyState
			title="No authors"
			description="There are no authors. Try to refresh"
			:on-refresh="refresh"
			icon="i-lucide-users"
		/>
	</div>
</template>
