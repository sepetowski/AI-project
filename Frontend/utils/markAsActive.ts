import type { NavigationMenuItem } from '@nuxt/ui';

export function markAsActive(items: NavigationMenuItem[], path: string): NavigationMenuItem[] {
	return items.map((i) => {
		const toStr = typeof i.to === 'string' ? i.to : '';
		const children = i.children ? markAsActive(i.children, path) : undefined;
		const selfActive = toStr ? path.startsWith(toStr) : false;
		const childActive = children?.some((c) => c.active) ?? false;
		return { ...i, active: i.active ?? (selfActive || childActive), children };
	});
}
