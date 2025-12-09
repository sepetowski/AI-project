<script setup lang="ts">
import { Role } from '~~/enums/roles';
import ManageKey from '~/components/keys/MangeKey.vue';
definePageMeta({ role: Role.Admin });
</script>

<template>
	<ManageKey />
</template>
