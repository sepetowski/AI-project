<script setup lang="ts">
import { Role } from '~~/enums/roles';
import EmptyState from '~/components/shared/EmptyState.vue';
import type { CategoriesRes } from '~~/types/Category';

definePageMeta({ role: Role.Admin });

const { data, refresh } = await useServerFetch<CategoriesRes>('/categories');
</script>

<template>
	<div v-if="data && data.amount > 0">
		<p>{{ data.amount }}</p>
	</div>

	<div v-else>
		<EmptyState
			title="No categories"
			description="Try adding a new category or refreshing the page."
			:on-refresh="refresh"
			icon="i-heroicons-tag"
		/>
	</div>
</template>
