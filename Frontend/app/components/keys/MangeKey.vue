<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useClipboard } from '@vueuse/core';
import type { AdminKey } from '~~/types/AdminKey';

const adminKey = ref<AdminKey | null>(null);
const loading = ref(false);
const regenerating = ref(false);
const showKey = ref(false);
const errorMessage = ref<string | null>(null);

const { copy, copied } = useClipboard();

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

const now = ref(Date.now());
let nowInterval: ReturnType<typeof setInterval> | null = null;

const validUntilDate = computed(() =>
	adminKey.value ? new Date(adminKey.value.validUntilUtc) : null
);

const updatedAtDate = computed(() =>
	adminKey.value ? new Date(adminKey.value.updatedAtUtc) : null
);

const remainingMs = computed(() => {
	if (!validUntilDate.value) return 0;
	return validUntilDate.value.getTime() - now.value;
});

const isExpired = computed(() => remainingMs.value <= 0);

const remainingText = computed(() => {
	if (!validUntilDate.value) return 'No data';
	const ms = remainingMs.value;
	if (ms <= 0) return 'Key expired';

	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	if (minutes <= 0) {
		return `${seconds}s`;
	}

	return `${minutes}m ${seconds}s`;
});

function scheduleAutoRefresh() {
	if (refreshTimeout) {
		clearTimeout(refreshTimeout);
		refreshTimeout = null;
	}

	if (!validUntilDate.value) return;

	const ms = validUntilDate.value.getTime() - Date.now();
	if (ms <= 0) {
		fetchKey(false);
		return;
	}

	refreshTimeout = setTimeout(() => {
		fetchKey(false);
	}, ms + 1000);
}

const fetchKey = async (showToastOnSuccess = false) => {
	loading.value = true;
	errorMessage.value = null;

	const { data, error } = await useClientFetch<AdminKey>('/auth/getKey', {
		method: 'POST',
		successToast: showToastOnSuccess
			? {
					showToastOnSuccess: true,
					toast: {
						title: 'Admin key fetched',
						desc: '',
					},
			  }
			: undefined,
	});

	loading.value = false;

	if (error.value) {
		errorMessage.value = 'Failed to fetch admin key';
		return;
	}

	if (data.value) {
		adminKey.value = data.value;
		showKey.value = false;
		scheduleAutoRefresh();
	}
};

const regenerateKey = async () => {
	regenerating.value = true;
	errorMessage.value = null;

	const { data, error } = await useClientFetch<AdminKey>('/auth/regenerateKey', {
		method: 'POST',
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title: 'Admin key regenerated',
				desc: '',
			},
		},
	});

	regenerating.value = false;

	if (error.value) {
		errorMessage.value = 'Failed to regenerate admin key';
		return;
	}

	if (data.value) {
		adminKey.value = data.value;
		showKey.value = false;
		scheduleAutoRefresh();
	}
};

const copyKey = async () => {
	if (!adminKey.value) return;
	await copy(adminKey.value.key);
};

onMounted(() => {
	fetchKey(false);

	nowInterval = setInterval(() => {
		now.value = Date.now();
	}, 1000);
});

onBeforeUnmount(() => {
	if (refreshTimeout) {
		clearTimeout(refreshTimeout);
	}
	if (nowInterval) {
		clearInterval(nowInterval);
	}
});
</script>

<template>
	<UContainer class="py-8">
		<UCard>
			<template #header>
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-lg font-semibold">Admin key</h2>
						<p class="text-sm text-dimmed">Manage the access key for administrative operations.</p>
					</div>
					<UButton
						color="primary"
						variant="solid"
						:loading="regenerating"
						icon="i-heroicons-key"
						@click="regenerateKey"
					>
						Regenerate key
					</UButton>
				</div>
			</template>

			<div class="space-y-4">
				<UAlert
					v-if="errorMessage"
					color="error"
					variant="subtle"
					icon="i-heroicons-exclamation-triangle"
				>
					{{ errorMessage }}
				</UAlert>

				<div v-if="loading && !adminKey">
					<USkeleton class="h-10 w-full mb-2" />
					<USkeleton class="h-4 w-1/3" />
				</div>

				<div v-else-if="adminKey" class="space-y-4">
					<div class="flex items-center gap-2">
						<span class="text-sm text-dimmed">Status:</span>
						<UBadge :color="isExpired ? 'error' : 'primary'" variant="soft">
							{{ isExpired ? 'Expired – fetching new…' : 'Active' }}
						</UBadge>
					</div>

					<div class="flex flex-col gap-2">
						<label class="text-sm text-dimmed">Key:</label>
						<div class="flex gap-2 items-center">
							<UInput
								:model-value="showKey ? adminKey.key : '••••••••••••••••••••••••'"
								readonly
								class="flex-1"
							/>
							<UButton variant="ghost" icon="i-heroicons-eye" @click="showKey = !showKey">
								{{ showKey ? 'Hide' : 'Show' }}
							</UButton>
							<UButton
								variant="ghost"
								icon="i-heroicons-clipboard"
								:disabled="!showKey"
								@click="copyKey"
							>
								{{ copied ? 'Copied!' : 'Copy' }}
							</UButton>
						</div>
						<p v-if="!showKey" class="text-xs text-gray-400">
							Click "Show" first to be able to copy the key.
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-dimmed">
						<div>
							<div class="font-medium text-gray-700">Updated at:</div>
							<div>
								{{ updatedAtDate?.toLocaleString() ?? '—' }}
							</div>
						</div>
						<div>
							<div class="font-medium text-gray-700">Valid until:</div>
							<div>
								{{ validUntilDate?.toLocaleString() ?? '—' }}
							</div>
						</div>
						<div>
							<div class="font-medium text-gray-700">Remaining time:</div>
							<div>
								{{ remainingText }}
							</div>
						</div>
					</div>
				</div>

				<div v-else class="text-sm text-dimmed">No key data. Try fetching it again.</div>
			</div>

			<template #footer>
				<span class="text-xs text-gray-400">
					When the key expires, it is automatically refreshed.
				</span>
			</template>
		</UCard>
	</UContainer>
</template>
