export default defineEventHandler(async (event) => {
	const token = getCookie(event, 'auth.token');
	const res = await $fetch('http://localhost:7100/api/Books', {
		method: 'GET',
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});

	return res;
});
