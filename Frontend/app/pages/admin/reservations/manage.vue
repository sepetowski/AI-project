<script setup lang="ts">
import { Role } from '~~/enums/roles';
import EmptyState from '~/components/shared/EmptyState.vue';
import ReservationsManage from '~/components/tables/ReservationsManage.vue';
import type { ReservationRes } from '~~/types/Reservation';

definePageMeta({ role: Role.Admin });

const { data, refresh } = await useServerFetch<ReservationRes>('/reservations');
</script>

<template>
	<div v-if="data && data.amount > 0">
		<ReservationsManage :data="data" />
	</div>

	<div v-else>
		<EmptyState title="No reservations" :on-refresh="refresh" icon="i-heroicons-tag" />
	</div>
</template>
