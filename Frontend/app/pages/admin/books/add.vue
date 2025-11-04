<script setup lang="ts">
import { Role } from '~~/enums/roles';
import BookForm from '../../../components/book/BookForm.vue';

definePageMeta({ role: Role.Admin });
</script>

<template>
	<BookForm />
</template>
