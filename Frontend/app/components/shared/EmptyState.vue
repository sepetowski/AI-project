<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
	title: { type: String, required: true },
	description: { type: String, default: '' },
	onRefresh: { type: Function, default: null },
	icon: { type: String, default: 'i-heroicons-document-text' },
});

const isRefreshing = ref(false);
const iconName = computed(() => props.icon || 'i-heroicons-document-text');

async function handleRefresh() {
	if (!props.onRefresh || isRefreshing.value) return;
	try {
		isRefreshing.value = true;
		await props.onRefresh();
	} finally {
		isRefreshing.value = false;
	}
}
</script>

<template>
	<div class="w-full min-h-[300px] flex items-center justify-center py-10 px-4">
		<UCard class="max-w-md w-full text-center">
			<div class="flex flex-col items-center">
				<UIcon :name="iconName" class="text-gray-400 dark:text-gray-500 mb-3" size="2xl" />

				<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
					{{ title }}
				</h3>

				<p v-if="description" class="text-gray-500 dark:text-gray-400 mt-1 mb-4">
					{{ description }}
				</p>

				<UButton
					v-if="onRefresh"
					:disabled="isRefreshing"
					:aria-busy="isRefreshing"
					color="primary"
					variant="solid"
					class="mt-1"
					@click="handleRefresh"
				>
					<template v-if="isRefreshing">
						<UIcon name="i-heroicons-arrow-path" class="animate-spin mr-2" />
						Refreshing…
					</template>
					<template v-else>
						<UIcon name="i-heroicons-arrow-path" class="mr-2" />
						Refresh
					</template>
				</UButton>

				<slot />
			</div>
		</UCard>
	</div>
</template>
