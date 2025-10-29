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
];
