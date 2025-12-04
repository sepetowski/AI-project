<script setup lang="ts">
import { computed } from 'vue';
import type { AuthorDetailsRes } from '~~/types/Author';
import BookCard from '../cards/BookCards.vue';

const props = defineProps<{
	author: AuthorDetailsRes;
}>();

const booksCount = computed(() => props.author.books?.length ?? 0);
</script>

<template>
	<div class="mt-24 max-w-6xl mx-auto px-4">
		<UCard>
			<h1 class="font-bold text-3xl tracking-tight">{{ author.name }} {{ author.surname }}</h1>

			<div class="mt-4 space-y-3 text-sm md:text-base leading-relaxed">
				<p v-if="author.dateOfBirth">
					<span class="font-semibold">Born:</span>
					<span class="ml-1">{{ new Date(author.dateOfBirth).toISOString().slice(0, 10) }}</span>
				</p>

				<div v-if="author.description" class="pt-2">
					<p class="font-semibold mb-1">About the author:</p>
					<p class="whitespace-pre-line">
						{{ author.description }}
					</p>
				</div>

				<p v-else class="italic">No description available for this author.</p>
			</div>
		</UCard>

		<UCard class="mt-10">
			<div class="flex items-baseline justify-between">
				<h2 class="text-2xl font-semibold tracking-tight">
					Books by {{ author.name }} {{ author.surname }}
				</h2>
			</div>

			<div
				v-if="booksCount > 0"
				class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6"
			>
				<BookCard v-for="book in author.books" :key="book.id" :book="book" />
			</div>

			<div class="py-12 text-center" v-else>
				<p class="text-lg text-dimmed">This author has no books in the catalog.</p>
			</div>
		</UCard>
	</div>
</template>
