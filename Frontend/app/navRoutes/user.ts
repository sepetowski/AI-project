import type { NavigationMenuItem } from '@nuxt/ui';

export const USER: NavigationMenuItem[] = [
	{
		label: 'Authors',
		icon: 'i-lucide-users',
		to: '/authors',
	},
	{
		label: 'Books',
		icon: 'i-lucide-book',
		to: '/books',
	},
	{
		label: 'My Account',
		icon: 'i-lucide-user-circle',
		to: '/my-account',
	},
];
