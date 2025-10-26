import { createBaseApiUrl } from '../../utils/createBaseApiUrl';

export const useApiFetch = (url: string, options: any = {}) => {
	const { token } = useAuth();

	return useFetch(createBaseApiUrl(url), {
		...options,
		headers: {
			...(options.headers || {}),
			Authorization: token.value ? token.value : undefined,
		},
	});
};
