<script setup lang="ts">
const { signUp } = useAuth();

const doRegister = async () => {
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
</script>

<template>
	<div>
		<UButton @click="doRegister">Register</UButton>
	</div>
</template>
