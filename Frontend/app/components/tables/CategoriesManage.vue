<script setup lang="ts">
import { computed, ref, watch, h, resolveComponent } from 'vue';
import { getPaginationRowModel } from '@tanstack/vue-table';
import type { CategoriesRes, Category } from '~~/types/Category';
import type { TableColumn } from '@nuxt/ui';
import { useClientFetch } from '#imports';

const props = defineProps<{ data: CategoriesRes }>();

const q = ref('');
const pagination = ref({ pageIndex: 0, pageSize: 10 });

const pageSizeProxy = computed({
	get: () => pagination.value.pageSize,
	set: (v: number) => (pagination.value.pageSize = v),
});

const allCategories = ref<Category[]>([]);

watch(
	() => props.data?.categories,
	(categories) => {
		allCategories.value = categories ? [...categories] : [];
	},
	{ immediate: true }
);

const filtered = computed<Category[]>(() => {
	const needle = q.value.trim().toLowerCase();
	if (!needle) return allCategories.value;

	return allCategories.value.filter((c) => c.name.toLowerCase().includes(needle));
});

watch([q, () => props.data, pageSizeProxy], () => (pagination.value.pageIndex = 0));

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const editCategory = (category: Category) =>
	navigateTo(`/admin/categories/category/${category.id}`);

const deleteCategory = async (category: Category) => {
	const { error } = await useClientFetch(`/categories/${category.id}`, {
		method: 'DELETE',
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title: 'Category was deleted',
				desc: `${category.name}`,
			},
		},
	});

	if (!error.value) {
		allCategories.value = allCategories.value.filter((c) => c.id !== category.id);
	}
};

const getRowItems = (category: Category) => [
	{ type: 'label', label: 'Actions' },
	{
		label: 'Edit',
		onSelect() {
			editCategory(category);
		},
	},
	{
		label: 'Delete',
		onSelect() {
			deleteCategory(category);
		},
	},
];

const columns: TableColumn<Category>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.name),
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) =>
			h(
				'div',
				{ class: 'text-right' },
				h(
					UDropdownMenu,
					{
						content: { align: 'end' },
						items: getRowItems(row.original),
						'aria-label': 'Actions dropdown',
					},
					() =>
						h(UButton, {
							icon: 'i-lucide-ellipsis-vertical',
							color: 'neutral',
							variant: 'ghost',
							class: 'ml-auto',
							'aria-label': 'Actions dropdown',
						})
				)
			),
	},
];

const table = useTemplateRef('table');
</script>

<template>
	<div class="flex-1 w-full p-8 mt-8">
		<UCard>
			<template #header>
				<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<h2 class="text-lg font-semibold">Categories</h2>
					<div class="flex items-center gap-2">
						<UInput v-model="q" placeholder="Search" icon="i-heroicons-magnifying-glass-20-solid" />
					</div>
				</div>
			</template>

			<UTable
				ref="table"
				v-model:pagination="pagination"
				:data="filtered"
				:columns="columns"
				:pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
				class="flex-1"
			/>

			<template #footer>
				<div class="flex justify-between items-center border-t border-default pt-4">
					<span class="text-sm text-gray-500">Categories: {{ filtered.length }}</span>
					<UPagination
						:default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
						:items-per-page="table?.tableApi?.getState().pagination.pageSize"
						:total="table?.tableApi?.getFilteredRowModel().rows.length"
						@update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
					/>
				</div>
			</template>
		</UCard>
	</div>
</template>

<style scoped></style>
