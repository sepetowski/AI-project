<script setup lang="ts">
import UserInfo from '~/components/user/UserInfo.vue';
import { Role } from '~~/enums/roles';

definePageMeta({ role: Role.User });
</script>

<template>
	<UserInfo />
</template>
