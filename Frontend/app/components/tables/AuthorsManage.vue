<script setup lang="ts">
import { computed, ref, watch, h, resolveComponent } from 'vue';
import { getPaginationRowModel } from '@tanstack/vue-table';
import type { AuthorsRes, Author } from '~~/types/Author';
import type { TableColumn } from '@nuxt/ui';
import { useClientFetch } from '#imports';

const props = defineProps<{ data: AuthorsRes }>();

const q = ref('');
const pagination = ref({ pageIndex: 0, pageSize: 10 });

const pageSizeProxy = computed({
	get: () => pagination.value.pageSize,
	set: (v: number) => (pagination.value.pageSize = v),
});

const allAuthors = ref<Author[]>([]);

watch(
	() => props.data?.authors,
	(authors) => {
		allAuthors.value = authors ? [...authors] : [];
	},
	{ immediate: true }
);

const filtered = computed<Author[]>(() => {
	const needle = q.value.trim().toLowerCase();
	if (!needle) return allAuthors.value;

	return allAuthors.value.filter((a) => `${a.name} ${a.surname}`.toLowerCase().includes(needle));
});

watch([q, () => props.data, pageSizeProxy], () => (pagination.value.pageIndex = 0));

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const editAuthor = (author: Author) => navigateTo(`/admin/authors/author/${author.id}`);

const deleteAuthor = async (author: Author) => {
	const { error } = await useClientFetch(`/authors/${author.id}`, {
		method: 'DELETE',
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title: 'Author was deleted',
				desc: `${author.name} ${author.surname}`,
			},
		},
	});

	if (!error.value) {
		allAuthors.value = allAuthors.value.filter((c) => c.id !== author.id);
	}
};

const getRowItems = (author: Author) => [
	{ type: 'label', label: 'Actions' },
	{
		label: 'Edit',
		onSelect() {
			editAuthor(author);
		},
	},
	{
		label: 'Delete',
		onSelect() {
			deleteAuthor(author);
		},
	},
];

const columns: TableColumn<Author>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.name),
	},
	{
		accessorKey: 'surname',
		header: 'Surname',
		cell: ({ row }) => row.original.surname,
	},
	{
		id: 'dob',
		header: 'Birth date',
		cell: ({ row }) => row.original.dateOfBirth || '—',
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
					<h2 class="text-lg font-semibold">Authors</h2>
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
					<span class="text-sm text-gray-500">Authors: {{ filtered.length }}</span>
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
