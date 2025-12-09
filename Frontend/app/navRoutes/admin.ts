import type { NavigationMenuItem } from '@nuxt/ui';

export const ADMIN: NavigationMenuItem[] = [
	{
		label: 'Authors',
		icon: 'i-lucide-users',
		to: '/authors',
		children: [
			{ label: 'Manage', to: '/admin/authors/manage', icon: 'i-lucide-table-2' },
			{ label: 'Add', to: '/admin/authors/add', icon: 'i-lucide-user-plus' },
		],
	},
	{
		label: 'Books',
		icon: 'i-lucide-book-open',
		to: '/books',
		children: [
			{ label: 'Manage', to: '/admin/books/manage', icon: 'i-lucide-table-2' },
			{ label: 'Add', to: '/admin/books/add', icon: 'i-lucide-plus' },
		],
	},
	{
		label: 'Categories',
		icon: 'i-lucide-book-open',
		to: '/admin/categories/manage',
		children: [
			{ label: 'Manage', to: '/admin/categories/manage', icon: 'i-lucide-table-2' },
			{ label: 'Add', to: '/admin/categories/add', icon: 'i-lucide-plus' },
		],
	},
	{
		label: 'System',
		icon: 'i-lucide-book-open',
		children: [
			{ label: 'Reservations', to: '/admin/reservations/manage', icon: 'i-lucide-table-2' },
			{ label: 'Loans', to: '/admin/loans/manage', icon: 'i-lucide-plus' },
			{ label: 'Users', to: '/admin/users/manage', icon: 'i-lucide-plus' },
			{ label: 'Keys', to: '/admin/keys/manage', icon: 'i-lucide-plus' },
		],
	},
];
