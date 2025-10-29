<script setup lang="ts">
const { status, signOut } = useAuth();
const items = await useNavRoutes();
const router = useRouter();

watch(status, (newStatus) => {
	if (newStatus === 'unauthenticated') {
		router.push('/');
	}
});
</script>

<template>
	<UHeader mode="slideover">
		<template #title>
			<p>OnlineLibrary</p>
		</template>

		<template v-if="status === 'authenticated'">
			<UNavigationMenu :items="items" />
		</template>

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
			<div
				:class="[
					'flex flex-col justify-between',
					status === 'authenticated' ? 'h-[calc(92.5vh-var(--ui-header-height))]' : 'mt-2',
				]"
			>
				<template v-if="status === 'authenticated'">
					<UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
				</template>

				<template v-if="status === 'unauthenticated'">
					<div class="mt-auto">
						<UButton class="w-full" to="/auth/sign-up">Sign up for free</UButton>
						<UButton class="w-full mt-2" color="neutral" variant="soft" to="/auth/sign-in">
							Login
						</UButton>
					</div>
				</template>

				<template v-else-if="status === 'authenticated'">
					<UButton class="w-full" color="neutral" variant="soft" @click="signOut()">
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
