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
		const res = await $fetch(createBaseApiUrl('auth/login'), {
			method: 'POST',
			body,
		});

		return res;
	} catch (err: any) {
		return err;
	}
});
