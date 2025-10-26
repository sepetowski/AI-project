import type { StringOrVNode } from '@nuxt/ui/runtime/types/utils.js';
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack';

interface Toast {
	showToastOnSuccess: boolean;
	toast: {
		title: string;
		desc?: StringOrVNode;
	};
}
export type ApiFetchOptions = Omit<
	NitroFetchOptions<NitroFetchRequest>,
	'headers' | 'query' | 'params'
> & {
	headers?: HeadersInit;
	query?: Record<string, any>;
	params?: Record<string, any>;
	successToast?: Toast;
};
