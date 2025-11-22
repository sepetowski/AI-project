<script setup lang="ts">
import { computed, ref, watch, h, resolveComponent } from 'vue';
import { getPaginationRowModel } from '@tanstack/vue-table';
import type { BooksRes, Book } from '~~/types/Book';
import type { TableColumn } from '@nuxt/ui';
import { useClientFetch } from '#imports';

const props = defineProps<{ data: BooksRes }>();

const q = ref('');
const pagination = ref({ pageIndex: 0, pageSize: 10 });

const pageSizeProxy = computed({
	get: () => pagination.value.pageSize,
	set: (v: number) => (pagination.value.pageSize = v),
});

const allBooks = ref<Book[]>([]);

watch(
	() => props.data?.books,
	(books) => {
		allBooks.value = books ? [...books] : [];
	},
	{ immediate: true }
);

const filtered = computed<Book[]>(() => {
	const needle = q.value.trim().toLowerCase();
	if (!needle) return allBooks.value;
	return allBooks.value.filter((b) => {
		const author = `${b.authorName} ${b.authorSurname}`.toLowerCase();
		const cats = b.categories
			.map((c) => c.name)
			.join(', ')
			.toLowerCase();
		return (
			b.title.toLowerCase().includes(needle) || author.includes(needle) || cats.includes(needle)
		);
	});
});

watch([q, () => props.data, pageSizeProxy], () => (pagination.value.pageIndex = 0));

const UBadge = resolveComponent('UBadge');
const UAvatar = resolveComponent('UAvatar');
const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const editBook = (book: Book) => navigateTo(`/admin/books/book/${book.id}`);

const deleteBook = async (book: Book) => {
	const { error } = await useClientFetch(`/books/${book.id}`, {
		method: 'DELETE',
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title: 'Book was deleted',
				desc: `${book.title}`,
			},
		},
	});

	if (!error.value) {
		allBooks.value = allBooks.value.filter((b) => b.id !== book.id);
	}
};

const getRowItems = (book: Book) => {
	return [
		{ type: 'label', label: 'Actions' },
		{
			label: 'Edit',
			onSelect() {
				editBook(book);
			},
		},
		{
			label: 'Delete',
			onSelect() {
				deleteBook(book);
			},
		},
	];
};

const columns: TableColumn<Book>[] = [
	{
		id: 'cover',
		header: 'Cover',
		cell: ({ row }) =>
			h(
				UAvatar,
				{ src: row.original.imageUrl ?? undefined, alt: row.original.title, size: 'lg' },
				{ default: () => row.original.title?.charAt(0) }
			),
	},
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.title),
	},
	{
		id: 'author',
		header: 'Author',
		cell: ({ row }) => `${row.original.authorName} ${row.original.authorSurname}`,
	},
	{
		id: 'categories',
		header: 'Categories',
		cell: ({ row }) =>
			h(
				'div',
				{ class: 'flex flex-wrap gap-1' },
				row.original.categories.map((c) =>
					h(UBadge, { key: c.id, size: 'sm', variant: 'soft' }, () => c.name)
				)
			),
	},
	{
		accessorKey: 'isAvaible',
		header: 'Available',
		cell: ({ row }) =>
			h(UBadge, { color: row.original.isAvaible ? 'green' : 'gray', variant: 'soft' }, () =>
				row.original.isAvaible ? 'Yes' : 'No'
			),
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
	<div class="flex-1 w-full mt-4">
		<UCard>
			<template #header>
				<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<h2 class="text-lg font-semibold">Books</h2>
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
					<span class="text-sm text-gray-500">Books: {{ filtered.length }}</span>
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
