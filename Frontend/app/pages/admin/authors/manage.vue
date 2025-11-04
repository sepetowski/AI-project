<script setup lang="ts">
import { Role } from '~~/enums/roles';
import EmptyState from '~/components/shared/EmptyState.vue';
import type { AuthorsRes } from '~~/types/Author';

definePageMeta({ role: Role.Admin });

const { data, refresh } = await useServerFetch<AuthorsRes>('/authors');
</script>

<template>
	<div v-if="data && data.amount > 0">
		<p>{{ data.amount }}</p>
	</div>

	<div v-else>
		<EmptyState
			title="No authors"
			description="Try adding a new author or refreshing the page."
			:on-refresh="refresh"
			icon="i-heroicons-inbox"
		/>
	</div>
</template>
