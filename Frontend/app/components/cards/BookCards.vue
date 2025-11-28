<script setup lang="ts">
import type { Book } from '~~/types/Book';

defineProps<{
	book: Book;
}>();
</script>

<template>
	<NuxtLink :to="`/books/book/${book.id}`" class="block h-full">
		<UCard class="flex flex-col h-full cursor-pointer hover:opacity-75 transition">
			<div class="flex gap-2">
				<div class="w-32 h-44 overflow-hidden rounded-xl flex-shrink-0">
					<NuxtImg :src="book.imageUrl || '/book-cover.jpg'" class="w-full h-full object-cover" />
					/>
				</div>

				<div class="flex flex-col flex-1 min-w-0 ml-2">
					<h3 class="font-bold text-xl leading-tight line-clamp-2 break-words">
						{{ book.title }}
					</h3>
					<p class="text-base mt-4 text-gray-400">{{ book.authorName }} {{ book.authorSurname }}</p>

					<div class="mt-4 flex flex-wrap gap">
						<UBadge v-for="cat in book.categories" :key="cat.id" size="sm" variant="soft">
							{{ cat.name }}
						</UBadge>
					</div>
				</div>
			</div>

			<div class="flex justify-end mt-4">
				<UBadge size="lg" :color="book.isAvaible ? 'primary' : 'error'" variant="solid">
					{{ book.isAvaible ? 'Available' : 'Not available' }}
				</UBadge>
			</div>
		</UCard>
	</NuxtLink>
</template>
