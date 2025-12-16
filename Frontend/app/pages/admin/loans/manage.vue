<script setup lang="ts">
import { Role } from '~~/enums/roles';
import EmptyState from '~/components/shared/EmptyState.vue';
import LoansManage from '~/components/tables/LoansManage.vue';
import type { LoanRes } from '~~/types/Loan';

definePageMeta({ role: Role.Admin });

const { data, refresh } = await useServerFetch<LoanRes>('/loans');
</script>

<template>
	<div v-if="data && data.amount > 0">
		<LoansManage :data="data" />
	</div>

	<div v-else>
		<EmptyState title="No reservations" :on-refresh="refresh" icon="i-lucide-handshake" />
	</div>
</template>
