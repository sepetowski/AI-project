export default defineEventHandler(async (event) => {
	const { payload } = await readBody<{
		provider: string;
		payload: {
			username: string;
			email: string;
			password: string;
			confirmPassword: string;
		};
	}>(event);

	const { username, email, password, confirmPassword } = payload;

	const body = {
		username,
		email,
		password,
		confirmPassword,
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
