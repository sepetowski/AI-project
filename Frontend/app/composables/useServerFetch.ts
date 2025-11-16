import { createBaseApiUrl } from '../../utils/createBaseApiUrl';
import type { UseFetchOptions } from '#app';
import type { NitroFetchRequest } from 'nitropack';
import { unref } from 'vue';

export function useServerFetch<T = unknown>(
	url: NitroFetchRequest,
	options: UseFetchOptions<T> = {},
	showTost: boolean = true
) {
	const { token } = useAuth();
	const toast = import.meta.client ? useToast() : null;

	const baseHeaders = (unref(options.headers) ?? {}) as HeadersInit;
	const auth = token.value && token.value.length > 0 ? token.value : undefined;
	const headers: HeadersInit = auth
		? { ...(baseHeaders as Record<string, string>), Authorization: auth }
		: baseHeaders;

	const res = useFetch(createBaseApiUrl(url as string), {
		...options,
		headers,
		onResponseError: async (ctx) => {
			const msg =
				(ctx.response as any)?._data?.message ??
				(ctx.error as any)?.data?.message ??
				(ctx.error as any)?.message ??
				'Something went wrong';

			if (showTost && toast) {
				toast.add({
					title: 'Oops!',
					description: msg,
					color: 'error',
					icon: 'i-heroicons-x-circle',
				});
			}
		},
	});

	return res;
}
