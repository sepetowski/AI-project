import { Role } from '~~/enums/roles';
import type { AppSession } from '~~/types/AppSession';

export default defineNuxtRouteMiddleware(async () => {
	const { status, getSession } = useAuth();

	if (status.value === 'authenticated') {
		const session = (await getSession()) as AppSession;

		if (session?.user?.role === Role.Admin) {
			return;
		}

		return navigateTo('/');
	}

	return navigateTo('/auth/sign-in');
});
