<script setup lang="ts">
const { status, data, signUp, signIn, signOut } = useAuth();
const error = ref<string | null>(null);

const doRegister = async () => {
	error.value = null;
	try {
		const res = await signUp({
			provider: 'local',
			payload: {
				username: 'testuser',
				email: 'test@x.com',
				password: 'P@ssw0rd!',
				confirmPassword: 'P@ssw0rd!',
			},
		});
	} catch (e: any) {}
};

const doLogin = async () => {
	error.value = null;
	try {
		const res = await signIn({
			provider: 'local',
			payload: {
				username: 'testuser',
				password: 'P@ssw0rd!',
			},
		});
	} catch (e: any) {}
};

const doTest = async () => {
	error.value = null;

	try {
		const result = await $fetch('/api/books/all', {
			method: 'GET',
		});

		console.log(result);
	} catch (e: any) {
		error.value = e.message;
		console.error('Błąd:', e);
	}
};
</script>

<template>
	<div>
		<p>Status: {{ status }}</p>
		<UButton @click="doRegister">Register</UButton>
		<UButton @click="doLogin">Login</UButton>
		<UButton @click="doTest">Test</UButton>
		<UButton @click="signOut({ redirect: false })">Log out</UButton>
	</div>
</template>
