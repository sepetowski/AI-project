import { jwtDecode } from 'jwt-decode';
import { Role } from '~~/enums/roles';
import { User } from '~~/types/AppSession';

export default defineEventHandler((event) => {
	const token = getCookie(event, 'auth.token');
	if (!token) return { authenticated: false };

	try {
		const payload = jwtDecode<Record<string, any>>(token);
		const roleString = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
		const role = roleString === 'Admin' ? Role.Admin : Role.User;

		const user: User = {
			id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
			username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
			email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
			role,
			firstName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
			lastName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
		};

		return {
			id: user.id,
			authenticated: true,
			user,
		};
	} catch {
		return { authenticated: false };
	}
});
