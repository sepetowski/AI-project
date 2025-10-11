import { createBaseApiUrl } from '~~/server/utils/CreateBaseApiUrl';

export default defineEventHandler(async (event) => {
	const { refreshToken } = await readBody<{ refreshToken?: string }>(event);

	const body = {
		refreshToken,
	};

	try {
		return await $fetch(createBaseApiUrl('auth/refreshToken'), {
			method: 'POST',
			body,
		});
	} catch (err: any) {
		return err;
	}
});
