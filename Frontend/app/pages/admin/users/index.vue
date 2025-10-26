<script setup lang="ts">
import { Role } from '~~/enums/roles';

definePageMeta({ role: Role.Admin });
</script>

<template>
	<div>Only admin page</div>
</template>
