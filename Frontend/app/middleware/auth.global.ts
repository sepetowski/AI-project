import { Role } from '~~/enums/roles';
import type { AppSession } from '~~/types/AppSession';

export default defineNuxtRouteMiddleware(async (to) => {
	const { status, getSession } = useAuth();

	const matched = to.matched.length !== 0;
	if (!matched) {
		return navigateTo('/not-found');
	}

	const isPublic = Boolean((to.meta as any).public);
	const isGuestOnly = Boolean((to.meta as any).guestOnly);

	if (isPublic) return;

	if (isGuestOnly && status.value === 'authenticated') {
		return navigateTo('/books');
	}

	if (!isGuestOnly && status.value === 'unauthenticated') {
		return navigateTo({ path: '/auth/sign-in', query: { redirect: to.fullPath } });
	}

	const requiredRole = (to.meta as any).role as Role | undefined;
	if (requiredRole !== undefined) {
		const session = (await getSession()) as AppSession | null;
		if (session?.user?.role !== requiredRole) {
			return navigateTo('/books');
		}
	}
});
