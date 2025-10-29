import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { markAsActive } from '../../utils/markAsActive';
import type { NavigationMenuItem } from '@nuxt/ui';
import { Role } from '~~/enums/roles';
import { ADMIN } from '~/navRoutes/admin';
import { USER } from '~/navRoutes/user';

export async function useNavRoutes() {
	const route = useRoute();
	const currentUser = await useGetCurrentUser();

	if (!currentUser) return [];

	const data = currentUser.role === Role.Admin ? ADMIN : USER;

	return computed<NavigationMenuItem[]>(() => markAsActive(data, route.path));
}
