<script setup lang="ts">
import { Role } from '~~/enums/roles';
import CategoryForm from '../../../components/forms/categories/CategoryForm.vue';

definePageMeta({ role: Role.Admin });
</script>

<template>
	<CategoryForm />
</template>
