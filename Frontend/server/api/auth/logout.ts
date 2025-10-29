export default defineEventHandler(async (event) => {
	deleteCookie(event, 'auth.token');
	deleteCookie(event, 'auth.refresh');

	return { authenticated: false };
});
