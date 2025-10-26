import { Role } from '../../../enums/roles';
import { createBaseApiUrl } from '../../../utils/createBaseApiUrl';

export default defineEventHandler(async (event) => {
	const { payload } = await readBody<{
		provider: string;
		payload: {
			username: string;
			email: string;
			password: string;
			confirmPassword: string;
			adminRoleKey?: string;
			role: Role;
		};
	}>(event);

	const { username, email, password, confirmPassword, role, adminRoleKey } = payload;

	const body = {
		username,
		email,
		password,
		confirmPassword,
		role,
		adminRoleKey: adminRoleKey ?? null,
	};

	try {
		return await $fetch(createBaseApiUrl('auth/register'), { method: 'POST', body });
	} catch (err: any) {
		throw createError({
			statusCode: err?.status || err?.response?.status || 500,
			statusMessage: err?.data || 'Registration failed',
		});
	}
});
