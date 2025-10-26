import { createBaseApiUrl } from '../../../utils/createBaseApiUrl';

export default defineEventHandler(async (event) => {
	const { payload } = await readBody<{
		provider: string;
		payload: {
			username: string;
			password: string;
		};
	}>(event);
	const { username, password } = payload;

	const body = {
		username,
		password,
	};

	try {
		var t = await $fetch(createBaseApiUrl('auth/login'), {
			method: 'POST',
			body,
		});
		return t;
	} catch (err: any) {
		throw createError({
			statusCode: err?.status || err?.response?.status || 500,
			statusMessage: err?.data || 'Registration failed',
		});
	}
});
