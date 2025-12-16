import type { NavigationMenuItem } from '@nuxt/ui';

export const ADMIN: NavigationMenuItem[] = [
	{
		label: 'Authors',
		icon: 'i-lucide-users',
		to: '/authors',
		children: [
			{
				label: 'Manage',
				to: '/admin/authors/manage',
				icon: 'i-lucide-list',
			},
			{
				label: 'Add',
				to: '/admin/authors/add',
				icon: 'i-lucide-user-plus',
			},
		],
	},
	{
		label: 'Books',
		icon: 'i-lucide-book',
		to: '/books',
		children: [
			{
				label: 'Manage',
				to: '/admin/books/manage',
				icon: 'i-lucide-library',
			},
			{
				label: 'Add',
				to: '/admin/books/add',
				icon: 'i-lucide-book-plus',
			},
		],
	},
	{
		label: 'Categories',
		icon: 'i-lucide-tags',
		to: '/admin/categories/manage',
		children: [
			{
				label: 'Manage',
				to: '/admin/categories/manage',
				icon: 'i-lucide-tag',
			},
			{
				label: 'Add',
				to: '/admin/categories/add',
				icon: 'i-lucide-plus',
			},
		],
	},
	{
		label: 'System',
		icon: 'i-lucide-settings',
		children: [
			{
				label: 'Reservations',
				to: '/admin/reservations/manage',
				icon: 'i-lucide-calendar-check',
			},
			{
				label: 'Loans',
				to: '/admin/loans/manage',
				icon: 'i-lucide-handshake',
			},
			{
				label: 'Users',
				to: '/admin/users/manage',
				icon: 'i-lucide-user-cog',
			},
			{
				label: 'Keys',
				to: '/admin/keys/manage',
				icon: 'i-lucide-key-round',
			},
		],
	},
];
