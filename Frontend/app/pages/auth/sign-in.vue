<script setup lang="ts">
const { signIn } = useAuth();

const doLogin = async () => {
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
</script>

<template>
	<div>
		<UButton @click="doLogin">Login</UButton>
	</div>
</template>
