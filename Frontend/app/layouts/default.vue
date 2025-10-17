<!-- layouts/default.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { NavigationMenuItem } from '@nuxt/ui';

const { status, signOut } = useAuth();
const route = useRoute();
const items = computed<NavigationMenuItem[]>(() => [
	{
		label: 'Books',
		to: '/docs/getting-started',
		icon: 'i-lucide-book-open',
		active: route.path.startsWith('/docs/getting-started'),
	},
]);
</script>

<template>
	<UHeader mode="slideover">
		<template #title>
			<p>OnlineLibrary</p>
		</template>

		<UNavigationMenu :items="items" />

		<template #right>
			<div class="hidden lg:block">
				<template v-if="status === 'unauthenticated'">
					<UButton color="neutral" variant="soft" to="/auth/sign-in">Login</UButton>
					<UButton class="ml-2" to="/auth/sign-up">Sign up for free</UButton>
				</template>

				<template v-else-if="status === 'authenticated'">
					<UButton color="neutral" variant="soft" @click="signOut({ redirect: false })">
						Logout
					</UButton>
				</template>
			</div>

			<UColorModeButton class="ml-3" />
		</template>

		<template #body>
			<div class="h-[calc(92.5vh-var(--ui-header-height))] flex flex-col justify-between">
				<UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
				<template v-if="status === 'unauthenticated'">
					<div class="mt-auto">
						<UButton class="w-full" to="/auth/sign-up">Sign up for free</UButton>
						<UButton class="w-full mt-2" color="neutral" variant="soft" to="/auth/sign-in">
							Login
						</UButton>
					</div>
				</template>

				<template v-else-if="status === 'authenticated'">
					<UButton
						class="w-full"
						color="neutral"
						variant="soft"
						@click="
							signOut({
								external: true,
								callbackUrl: `http://localhost:3000`,
							})
						"
					>
						Logout
					</UButton>
				</template>
			</div>
		</template>
	</UHeader>

	<UMain>
		<slot />
	</UMain>

	<UFooter />
</template>
