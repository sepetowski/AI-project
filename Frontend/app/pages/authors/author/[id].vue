<script setup lang="ts">
import AuthorDetails from '~/components/cards/AuthorDetails.vue';
import type { AuthorDetailsRes } from '~~/types/Author';

const route = useRoute();
const id = route.params.id;
const { data, refresh } = await useServerFetch<AuthorDetailsRes>(`/authors/${id}`);
if (!data.value) await navigateTo('/not-found', { replace: true });
</script>

<template>
	<AuthorDetails v-if="data" :author="data" @refresh="refresh" />
</template>
