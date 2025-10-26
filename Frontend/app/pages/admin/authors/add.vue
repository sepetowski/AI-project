<script setup lang="ts">
import { Role } from '~~/enums/roles';
import NewAuthorForm from '../../../components/author/NewAuthorForm.vue';

definePageMeta({ role: Role.Admin });
</script>

<template>
	<UContainer class="min-h-screen flex items-center justify-center">
		<UCard class="w-full max-w-md">
			<template #header>
				<div class="text-center space-y-1">
					<h1 class="text-2xl font-semibold">Add new author</h1>
				</div>
			</template>

			<NewAuthorForm />
		</UCard>
	</UContainer>
</template>
