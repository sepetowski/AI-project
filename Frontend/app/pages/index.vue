<script setup lang="ts">
definePageMeta({ guestOnly: true });

const features = [
	{
		icon: 'i-lucide-search',
		title: 'Search fast',
		desc: 'Find any book in seconds.',
	},
	{
		icon: 'i-lucide-book',
		title: 'Browse the catalog',
		desc: 'Explore what is available right now.',
	},
	{
		icon: 'i-lucide-calendar-check',
		title: 'Reserve',
		desc: 'Keep everything organized in one place.',
	},
];
</script>

<template>
	<div class="relative">
		<div class="pointer-events-none absolute inset-0">
			<div
				class="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
			/>
			<div class="absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
		</div>

		<UContainer class="relative py-16 sm:py-24">
			<div class="mx-auto max-w-3xl text-center">
				<UBadge color="primary" variant="soft" class="mb-4"> Welcome to OnlineLibrary </UBadge>

				<h1 class="text-3xl font-semibold tracking-tight sm:text-5xl">
					Your library, online — simple and fast.
				</h1>

				<p class="mt-4 text-base text-muted sm:text-lg">
					Browse books, discover authors, and manage your account in one clean place.
				</p>

				<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<UButton
						to="/auth/sign-in"
						color="primary"
						size="lg"
						icon="i-lucide-log-in"
						class="w-full sm:w-auto"
					>
						Login
					</UButton>

					<UButton
						to="/auth/sign-up"
						variant="soft"
						size="lg"
						icon="i-lucide-user-plus"
						class="w-full sm:w-auto"
					>
						Sign up
					</UButton>
				</div>
			</div>

			<div class="mx-auto mt-12 grid max-w-5xl gap-4 sm:mt-16 sm:grid-cols-3">
				<UCard v-for="f in features" :key="f.title" class="h-full">
					<template #header>
						<div class="flex items-center gap-3">
							<UIcon :name="f.icon" class="h-6 w-6 text-primary" />
							<div class="font-medium">{{ f.title }}</div>
						</div>
					</template>

					<p class="text-sm text-muted">
						{{ f.desc }}
					</p>
				</UCard>
			</div>
		</UContainer>
	</div>
</template>
