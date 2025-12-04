<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BookCard from '../cards/BookCards.vue';
import type { Book } from '~~/types/Book';
import type { SelectItem } from '@nuxt/ui';
import { Availability } from '../../../types/Availability';
const props = defineProps<{
	books: Book[];
}>();

const search = ref('');
const selectedCategoryId = ref<string | undefined>(undefined);
const availabilityFilter = ref<Availability | undefined>(Availability.Available);

const page = ref(1);
const pageSize = ref<number>(20);

const categoryItems = computed<SelectItem[]>(() => {
	const map = new Map<string, string>();

	for (const book of props.books) {
		for (const cat of book.categories ?? []) {
			if (!map.has(cat.id)) {
				map.set(cat.id, cat.name);
			}
		}
	}

	return Array.from(map.entries()).map(([value, label]) => ({
		label,
		value,
	}));
});

const availabilityItems = ref([
	{ label: 'All', value: Availability.All },
	{ label: 'Available', value: Availability.Available },
	{ label: 'Unavailable', value: Availability.Unavailable },
]);

const filteredBooks = computed(() => {
	const query = search.value.trim().toLowerCase();

	return props.books.filter((book) => {
		const matchesSearch =
			!query ||
			book.title.toLowerCase().includes(query) ||
			`${book.authorName} ${book.authorSurname}`.toLowerCase().includes(query);

		const matchesCategory =
			!selectedCategoryId.value ||
			(book.categories ?? []).some((c) => c.id === selectedCategoryId.value);

		let matchesAvailability = true;
		if (availabilityFilter.value === 'Available') {
			matchesAvailability = book.isAvaible === true;
		} else if (availabilityFilter.value === 'Unavailable') {
			matchesAvailability = book.isAvaible === false;
		}

		return matchesSearch && matchesCategory && matchesAvailability;
	});
});

const totalPages = computed(() =>
	Math.max(1, Math.ceil(filteredBooks.value.length / pageSize.value))
);

watch([filteredBooks, pageSize], () => {
	if (page.value > totalPages.value) {
		page.value = totalPages.value;
	}
});

const paginatedBooks = computed(() => {
	const start = (page.value - 1) * pageSize.value;
	const end = start + pageSize.value;
	return filteredBooks.value.slice(start, end);
});
</script>

<template>
	<div class="space-y-12 mt-4">
		<div class="flex flex-wrap gap-3 items-center justify-between">
			<div class="flex flex-wrap gap-3 items-center">
				<UInput
					v-model="search"
					placeholder="Search by title or author..."
					class="w-64 max-w-full"
					icon="i-heroicons-magnifying-glass-20-solid"
					clearable
				/>
				<USelectMenu
					v-model="selectedCategoryId"
					:items="categoryItems"
					value-key="value"
					placeholder="All categories"
					clearable
					class="min-w-40"
				/>
				<USelect
					v-model="availabilityFilter"
					:items="availabilityItems"
					placeholder="All"
					class="min-w-24"
				/>
			</div>
		</div>
		<div
			v-if="paginatedBooks.length"
			class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
		>
			<BookCard v-for="book in paginatedBooks" :key="book.id" :book="book" />
		</div>
		<div v-else class="py-10 text-center text-sm text-accent">No books match your filters.</div>
		<div v-if="totalPages > 1" class="flex justify-center pt-4">
			<UPagination v-model="page" :page-count="pageSize" :total="filteredBooks.length" size="sm" />
		</div>
	</div>
</template>
