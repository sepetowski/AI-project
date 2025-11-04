<script setup lang="ts">
import CategoryForm from '~/components/categories/CategoryForm.vue';
import { Role } from '~~/enums/roles';
import type { CategoryDetailsRes } from '~~/types/Category';
definePageMeta({ role: Role.Admin });

const route = useRoute();
const id = route.params.id;
const { data } = await useServerFetch<CategoryDetailsRes>(`/categories/${id}`);
</script>

<template>
	<CategoryForm :is-edit="true" :initial-data="data" />
</template>
