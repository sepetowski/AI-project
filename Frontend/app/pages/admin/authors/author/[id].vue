<script setup lang="ts">
import { Role } from '~~/enums/roles';
import type { AuthorDetailsRes } from '~~/types/Author';
definePageMeta({ role: Role.Admin });

const route = useRoute();
const id = route.params.id;
const { data } = await useServerFetch<AuthorDetailsRes>(`/authors/${id}`);
</script>

<template>
	<AuthorForm :is-edit="true" :initial-data="data" />
</template>
