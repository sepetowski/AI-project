<script setup lang="ts">
import { computed, ref, watch, h, resolveComponent } from 'vue';
import { getPaginationRowModel } from '@tanstack/vue-table';
import type { TableColumn } from '@nuxt/ui';
import type { Loan, LoanRes } from '~~/types/Loan';

const props = defineProps<{ data: LoanRes }>();

const q = ref('');
const pagination = ref({ pageIndex: 0, pageSize: 10 });

const pageSizeProxy = computed({
	get: () => pagination.value.pageSize,
	set: (v: number) => (pagination.value.pageSize = v),
});

const allLoans = ref<Loan[]>([]);

watch(
	() => props.data?.loans,
	(loans) => {
		allLoans.value = loans ? [...loans] : [];
	},
	{ immediate: true }
);

const filtered = computed<Loan[]>(() => {
	const needle = q.value.trim().toLowerCase();
	if (!needle) return allLoans.value;

	return allLoans.value.filter((l) => {
		const author = `${l.bookAuthorName} ${l.bookAuthorSurnameName}`.toLowerCase();
		const title = l.bookTitle.toLowerCase();
		const username = l.username.toLowerCase();

		return title.includes(needle) || author.includes(needle) || username.includes(needle);
	});
});

watch([q, () => props.data, pageSizeProxy], () => (pagination.value.pageIndex = 0));

const UAvatar = resolveComponent('UAvatar');

const columns: TableColumn<Loan>[] = [
	{
		id: 'cover',
		header: 'Cover',
		cell: ({ row }) =>
			h(
				UAvatar,
				{
					src: row.original.imageUrl ?? undefined,
					alt: row.original.bookTitle,
					size: 'lg',
				},
				{ default: () => row.original.bookTitle?.charAt(0) }
			),
	},
	{
		accessorKey: 'bookTitle',
		header: 'Book',
		cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.bookTitle),
	},
	{
		id: 'author',
		header: 'Author',
		cell: ({ row }) => `${row.original.bookAuthorName} ${row.original.bookAuthorSurnameName}`,
	},
	{
		id: 'user',
		header: 'User',
		cell: ({ row }) => row.original.username,
	},
	{
		id: 'loanDate',
		header: 'Loan date',
		cell: ({ row }) => new Date(row.original.loanDate).toLocaleDateString(),
	},
	{
		id: 'returnDate',
		header: 'Return date',
		cell: ({ row }) =>
			row.original.returnDate
				? new Date(row.original.returnDate).toLocaleDateString()
				: 'Not returned',
	},
];

const table = useTemplateRef('table');
</script>

<template>
	<div class="flex-1 w-full mt-4">
		<UCard>
			<template #header>
				<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<h2 class="text-lg font-semibold">Loans</h2>
					<div class="flex items-center gap-2">
						<UInput
							v-model="q"
							placeholder="Search..."
							icon="i-heroicons-magnifying-glass-20-solid"
						/>
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
					<span class="text-sm text-gray-500">Loans: {{ filtered.length }}</span>
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
