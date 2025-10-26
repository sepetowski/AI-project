import { useRouter, useRoute } from 'vue-router';
import { onMounted } from 'vue';

export function useAuthGreeting() {
	const route = useRoute();
	const router = useRouter();
	const toast = useToast();

	const handleAuthQuery = (query: Record<string, any>) => {
		if (query.new && query.username) {
			const isNew = query.new === 'true';
			const title = isNew ? `Welcome on board ${query.username}` : `Welcome back ${query.username}`;
			const description = isNew ? 'You have been registered' : 'You have been logged in';

			toast.clear();
			toast.add({
				title,
				description,
				color: 'success',
				icon: 'i-heroicons-check-circle',
			});

			setTimeout(() => {
				router.replace({ query: {} });
			}, 300);
		}
	};

	onMounted(() => {
		handleAuthQuery(route.query as any);
	});
}
