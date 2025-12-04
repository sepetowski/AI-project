<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AuthorCards from '../cards/AuthorCards.vue';
import type { Author } from '~~/types/Author';

const props = defineProps<{
	authors: Author[];
}>();

const search = ref('');

const page = ref(1);
const pageSize = ref<number>(20);

const filteredAuthors = computed(() => {
	const query = search.value.trim().toLowerCase();

	return props.authors.filter((author) => {
		if (!query) return true;

		const fullName = `${author.name} ${author.surname}`.toLowerCase();
		return fullName.includes(query) || (author.description ?? '').toLowerCase().includes(query);
	});
});

const totalPages = computed(() =>
	Math.max(1, Math.ceil(filteredAuthors.value.length / pageSize.value))
);

watch([filteredAuthors, pageSize], () => {
	if (page.value > totalPages.value) {
		page.value = totalPages.value;
	}
});

const paginatedAuthors = computed(() => {
	const start = (page.value - 1) * pageSize.value;
	const end = start + pageSize.value;
	return filteredAuthors.value.slice(start, end);
});
</script>

<template>
	<div class="space-y-12 mt-4">
		<div class="flex flex-wrap gap-3 items-center justify-between">
			<div class="flex flex-wrap gap-3 items-center">
				<UInput
					v-model="search"
					placeholder="Search..."
					class="w-64 max-w-full"
					icon="i-heroicons-magnifying-glass-20-solid"
					clearable
				/>
			</div>
		</div>

		<div
			v-if="paginatedAuthors.length"
			class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
		>
			<AuthorCards v-for="author in paginatedAuthors" :key="author.id" :author="author" />
		</div>
		<div v-else class="py-10 text-center text-sm text-accent">No authors match your filters.</div>

		<div v-if="totalPages > 1" class="flex justify-center pt-4">
			<UPagination
				v-model="page"
				:page-count="pageSize"
				:total="filteredAuthors.length"
				size="sm"
			/>
		</div>
	</div>
</template>
