<script setup lang="ts">
import { Role } from '~~/enums/roles';
import AuthorForm from '../../../components/forms/author/AuthorForm.vue';

definePageMeta({ role: Role.Admin });
</script>

<template>
	<AuthorForm />
</template>
