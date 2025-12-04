<script setup lang="ts">
import type { Author } from '~~/types/Author';

defineProps<{
	author: Author;
}>();
</script>

<template>
	<NuxtLink :to="`/authors/author/${author.id}`" class="block h-full">
		<UCard class="flex flex-col h-full cursor-pointer hover:opacity-75 transition">
			<div class="flex flex-col min-w-0">
				<h3 class="font-bold text-xl leading-tight line-clamp-2 break-words">
					{{ author.name }} {{ author.surname }}
				</h3>

				<p v-if="author.description" class="text-sm mt-4 line-clamp-3">
					{{ author.description }}
				</p>
			</div>
		</UCard>
	</NuxtLink>
</template>
