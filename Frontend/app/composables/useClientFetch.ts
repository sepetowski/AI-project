import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack';
import { ref, unref } from 'vue';
import type { ApiError } from '~~/types/ApiError';
import { createBaseApiUrl } from '~~/utils/createBaseApiUrl';
import type { ApiFetchOptions } from '../../types/ApiFetch';

export async function useClientFetch<T = unknown>(
	url: NitroFetchRequest,
	options: ApiFetchOptions = {}
) {
	const { token } = useAuth();
	const toast = useToast();

	const data = ref<T | null>(null);
	const error = ref<ApiError | null>(null);

	const baseHeaders = (unref(options.headers) ?? {}) as HeadersInit;
	const auth = token.value && token.value.length > 0 ? token.value : undefined;
	const headers: HeadersInit = auth
		? { ...(baseHeaders as Record<string, string>), Authorization: auth }
		: baseHeaders;

	const { params, query: q, method, ...rest } = options;
	const query = q ?? params;

	try {
		const result = await $fetch<T>(createBaseApiUrl(url as string), {
			...(rest as NitroFetchOptions<NitroFetchRequest>),
			method: method ?? 'get',
			headers,
			query,
		});

		data.value = result as unknown as T;
	} catch (e: any) {
		const msg = e?.data ?? 'Something went wrong';
		error.value = e;

		toast.add({
			title: 'Oops!',
			description: msg,
			color: 'error',
			icon: 'i-heroicons-x-circle',
		});

		data.value = null;
	} finally {
		if (!error.value && options?.successToast?.showToastOnSuccess)
			toast.add({
				title: options.successToast.toast.title,
				description: options.successToast.toast.desc,
				color: 'success',
				icon: 'i-heroicons-check-circle',
			});
	}
	return {
		data,
		error,
	};
}
