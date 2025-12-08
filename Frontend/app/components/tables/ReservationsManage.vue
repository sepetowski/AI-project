<script setup lang="ts">
import { computed, ref, watch, h, resolveComponent } from 'vue';
import { getPaginationRowModel } from '@tanstack/vue-table';
import type { ReservationRes, Reservation } from '~~/types/Reservation';
import type { TableColumn } from '@nuxt/ui';
import { useClientFetch } from '#imports';

const props = defineProps<{ data: ReservationRes }>();

const q = ref('');
const pagination = ref({ pageIndex: 0, pageSize: 10 });

const pageSizeProxy = computed({
	get: () => pagination.value.pageSize,
	set: (v: number) => (pagination.value.pageSize = v),
});

const allReservations = ref<Reservation[]>([]);

watch(
	() => props.data?.reservations,
	(reservations) => {
		allReservations.value = reservations ? [...reservations] : [];
	},
	{ immediate: true }
);

const filtered = computed<Reservation[]>(() => {
	const needle = q.value.trim().toLowerCase();
	if (!needle) return allReservations.value;

	return allReservations.value.filter((r) => {
		const author = `${r.bookAuthorName} ${r.bookAuthorSurnameName}`.toLowerCase();
		const title = r.bookTitle.toLowerCase();
		const username = r.username.toLowerCase();

		return title.includes(needle) || author.includes(needle) || username.includes(needle);
	});
});

watch([q, () => props.data, pageSizeProxy], () => (pagination.value.pageIndex = 0));

const UBadge = resolveComponent('UBadge');
const UAvatar = resolveComponent('UAvatar');
const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const deleteReservation = async (reservation: Reservation) => {
	const { error } = await useClientFetch(`/reservations/cancelReservation`, {
		method: 'POST',
		body: {
			id: reservation.id,
		},
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title: 'Reservation was canceled',
				desc: `${reservation.bookTitle} (${reservation.username})`,
			},
		},
	});

	if (!error.value) {
		allReservations.value = allReservations.value.map((r) =>
			r.id !== reservation.id ? r : { ...r, isActive: false }
		);
	}
};

const getRowItems = (reservation: Reservation) => {
	return [
		{ type: 'label', label: 'Actions' },
		{
			label: 'Cancel',
			onSelect() {
				deleteReservation(reservation);
			},
		},
	];
};

const columns: TableColumn<Reservation>[] = [
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
		id: 'username',
		header: 'User',
		cell: ({ row }) => row.original.username,
	},
	{
		id: 'reservationDate',
		header: 'Reservation date',
		cell: ({ row }) => {
			const d = new Date(row.original.reservationDate);
			return d.toLocaleDateString();
		},
	},
	{
		id: 'isActive',
		header: 'Active',
		cell: ({ row }) =>
			h(
				UBadge,
				{
					color: row.original.isActive ? 'primary' : 'error',
					variant: 'soft',
				},
				() => (row.original.isActive ? 'Yes' : 'No')
			),
	},
	{
		id: 'actions',
		header: '',
		cell: ({ row }) => {
			if (!row.original.isActive) return null;

			return h(
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
			);
		},
	},
];

const table = useTemplateRef('table');
</script>

<template>
	<div class="flex-1 w-full mt-4">
		<UCard>
			<template #header>
				<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<h2 class="text-lg font-semibold">Reservations</h2>
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
					<span class="text-sm text-gray-500">Reservations: {{ filtered.length }}</span>
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
