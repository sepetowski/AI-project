export function createBaseApiUrl(path: string): string {
	const config = useRuntimeConfig();
	const base = config.dotnet.baseUrl?.replace(/\/$/, '') || '';

	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	return `${base}${cleanPath}`;
}
