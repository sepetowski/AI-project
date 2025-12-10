import type { NavigationMenuItem } from '@nuxt/ui';

export const USER: NavigationMenuItem[] = [
	{
		label: 'Authors',
		icon: 'i-lucide-users',
		to: '/authors',
	},
	{
		label: 'Books',
		icon: 'i-lucide-book-open',
		to: '/books',
	},
	{
		label: 'My Account',
		icon: 'i-lucide-book-open',
		to: '/my-account',
	},
];
