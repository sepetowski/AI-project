export default defineNuxtRouteMiddleware((to, from) => {
	const { status } = useAuth();
	const publicPaths = ['/', '/auth/sign-in', '/auth/register'];

	if (publicPaths.includes(to.path)) return;

	if (status.value === 'unauthenticated') {
		return navigateTo('/auth/sign-in');
	}
});
