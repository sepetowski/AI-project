import { jwtDecode } from 'jwt-decode';

export default defineEventHandler((event) => {
	const token = getCookie(event, 'auth.token');
	if (!token) return { authenticated: false };

	try {
		const p = jwtDecode<{ name?: string; email?: string; role?: string }>(token);
		return { authenticated: true, user: { name: p.name, email: p.email, role: p.role } };
	} catch {
		return { authenticated: false };
	}
});
