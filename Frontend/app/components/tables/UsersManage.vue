<script setup lang="ts">
import { computed, ref, watch, h, resolveComponent } from 'vue';
import { getPaginationRowModel } from '@tanstack/vue-table';
import type { TableColumn } from '@nuxt/ui';
import type { AppUser, AppUserRes } from '~~/types/AppUser';

const props = defineProps<{ data: AppUserRes }>();

const q = ref('');
const pagination = ref({ pageIndex: 0, pageSize: 10 });

const pageSizeProxy = computed({
	get: () => pagination.value.pageSize,
	set: (v: number) => (pagination.value.pageSize = v),
});

const allUsers = ref<AppUser[]>([]);

watch(
	() => props.data?.users,
	(users) => {
		allUsers.value = users ? [...users] : [];
	},
	{ immediate: true }
);

const filtered = computed<AppUser[]>(() => {
	const needle = q.value.trim().toLowerCase();
	if (!needle) return allUsers.value;

	return allUsers.value.filter((u) => {
		const name = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
		return (
			u.email.toLowerCase().includes(needle) ||
			u.username.toLowerCase().includes(needle) ||
			name.includes(needle)
		);
	});
});

watch([q, () => props.data, pageSizeProxy], () => (pagination.value.pageIndex = 0));

const UAvatar = resolveComponent('UAvatar');

const columns: TableColumn<AppUser>[] = [
	{
		id: 'avatar',
		header: 'User',
		cell: ({ row }) =>
			h(
				UAvatar,
				{
					alt: row.original.username,
					size: 'lg',
				},
				{
					default: () => row.original.username.charAt(0).toUpperCase(),
				}
			),
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => row.original.email,
	},
	{
		accessorKey: 'username',
		header: 'Username',
		cell: ({ row }) => row.original.username,
	},
	{
		id: 'fullName',
		header: 'Name',
		cell: ({ row }) =>
			`${row.original.firstName ?? ''} ${row.original.lastName ?? ''}`.trim() || '—',
	},
	{
		id: 'createdAt',
		header: 'Created',
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
	},
];

const table = useTemplateRef('table');
</script>

<template>
	<div class="flex-1 w-full mt-4">
		<UCard>
			<template #header>
				<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<h2 class="text-lg font-semibold">Users</h2>
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
					<span class="text-sm text-gray-500">Users: {{ filtered.length }}</span>
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
