<script setup lang="ts">
import { Role } from '~~/enums/roles';
import EmptyState from '~/components/shared/EmptyState.vue';
import UsersManage from '~/components/tables/UsersManage.vue';
import type { AppUserRes } from '~~/types/AppUser';

definePageMeta({ role: Role.Admin });

const { data, refresh } = await useServerFetch<AppUserRes>('/auth/getUsers');
</script>

<template>
	<div v-if="data && data.amount > 0">
		<UsersManage :data="data" />
	</div>

	<div v-else>
		<EmptyState title="No users" :on-refresh="refresh" icon="i-lucide-user-cog" />
	</div>
</template>
