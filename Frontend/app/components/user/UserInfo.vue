<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Loan, LoanRes } from '~~/types/Loan';
import type { Reservation, ReservationRes } from '~~/types/Reservation';

const user = await useGetCurrentUser();

const loans = ref<Loan[]>([]);
const reservations = ref<Reservation[]>([]);

const loading = ref(false);
const errorMessage = ref<string | null>(null);

const loadingLoans = ref(false);
const loadingReservations = ref(false);

const returningLoanId = ref<string | null>(null);
const cancelingReservationId = ref<string | null>(null);

const activeTab = ref<'loans' | 'reservations' | 'history'>('loans');

const activeLoans = computed(() => loans.value.filter((l) => !l.returnDate));
const returnedLoans = computed(() => loans.value.filter((l) => !!l.returnDate));

const activeReservations = computed(() => reservations.value.filter((r) => r.isActive));
const inactiveReservations = computed(() => reservations.value.filter((r) => !r.isActive));

async function fetchLoans() {
	loadingLoans.value = true;
	errorMessage.value = null;

	const { data, error } = await useClientFetch<LoanRes>(`/loans/GetUserLoans/${user?.id}`, {
		method: 'GET',
	});

	loadingLoans.value = false;

	if (error.value) {
		errorMessage.value = 'Failed to fetch loans';
		return;
	}

	if (data.value) {
		loans.value = data.value.loans;
	}
}

async function fetchReservations() {
	loadingReservations.value = true;
	errorMessage.value = null;

	const { data, error } = await useClientFetch<ReservationRes>(
		`/reservations/GetUserReservations/${user?.id}`,
		{
			method: 'GET',
		}
	);

	loadingReservations.value = false;

	if (error.value) {
		errorMessage.value = 'Failed to fetch reservations';
		return;
	}

	if (data.value) {
		reservations.value = data.value.reservations;
	}
}

async function refreshAll() {
	loading.value = true;
	await Promise.all([fetchLoans(), fetchReservations()]);
	loading.value = false;
}

async function returnLoan(loan: Loan) {
	if (returningLoanId.value) return;

	returningLoanId.value = loan.id;
	errorMessage.value = null;

	const { error } = await useClientFetch<Loan>(`/loans/ReturnLoan`, {
		method: 'POST',
		body: {
			Id: loan.id,
		},
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title: 'Book returned',
				desc: loan.bookTitle,
			},
		},
	});

	returningLoanId.value = null;

	if (error.value) {
		errorMessage.value = 'Failed to return loan';
		return;
	}

	await fetchLoans();
}

async function cancelReservation(reservation: Reservation) {
	if (cancelingReservationId.value) return;

	cancelingReservationId.value = reservation.id;
	errorMessage.value = null;

	const { error } = await useClientFetch<Reservation>(`/reservations/CancelReservation`, {
		method: 'POST',
		body: {
			Id: reservation.id,
		},
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title: 'Reservation cancelled',
				desc: reservation.bookTitle,
			},
		},
	});

	cancelingReservationId.value = null;

	if (error.value) {
		errorMessage.value = 'Failed to cancel reservation';
		return;
	}

	await fetchReservations();
}

onMounted(() => {
	refreshAll();
});
</script>

<template>
	<UContainer class="py-8">
		<UCard>
			<template #header>
				<div class="flex items-center justify-between gap-4">
					<div>
						<h2 class="text-lg font-semibold">User activity</h2>
						<p class="text-sm text-dimmed">Borrowed books, reservations and return history.</p>
					</div>
					<UButton
						color="primary"
						variant="solid"
						icon="i-heroicons-arrow-path"
						:loading="loading"
						@click="refreshAll"
					>
						Refresh
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

				<div class="flex flex-wrap gap-2">
					<UButton
						size="sm"
						:variant="activeTab === 'loans' ? 'solid' : 'ghost'"
						@click="activeTab = 'loans'"
					>
						Borrowed ({{ activeLoans.length }})
					</UButton>
					<UButton
						size="sm"
						:variant="activeTab === 'reservations' ? 'solid' : 'ghost'"
						@click="activeTab = 'reservations'"
					>
						Reservations ({{ activeReservations.length }})
					</UButton>
					<UButton
						size="sm"
						:variant="activeTab === 'history' ? 'solid' : 'ghost'"
						@click="activeTab = 'history'"
					>
						Return history ({{ returnedLoans.length }})
					</UButton>
				</div>

				<div v-if="loadingLoans || loadingReservations">
					<USkeleton class="h-24 w-full mb-2" />
					<USkeleton class="h-24 w-full mb-2" />
				</div>

				<div v-else-if="activeTab === 'loans'">
					<div v-if="activeLoans.length === 0" class="text-sm text-dimmed">No active loans.</div>

					<div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div
							v-for="loan in activeLoans"
							:key="loan.id"
							class="border rounded-lg p-4 flex gap-4"
						>
							<div
								class="w-16 h-24 flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden rounded"
							>
								<img
									v-if="loan.imageUrl"
									:src="loan.imageUrl"
									alt="cover"
									class="w-full h-full object-cover"
								/>
								<img
									v-else
									:src="'/book-cover.jpg'"
									alt="cover"
									class="w-full h-full object-cover"
								/>
							</div>

							<div class="flex-1 flex flex-col justify-between">
								<div>
									<h3 class="font-semibold text-sm">
										{{ loan.bookTitle }}
									</h3>
									<p class="text-xs text-dimmed">
										{{ loan.bookAuthorName }} {{ loan.bookAuthorSurnameName }}
									</p>
									<p class="text-xs text-dimmed mt-1">
										Loan date:
										{{ new Date(loan.loanDate).toLocaleString() }}
									</p>
								</div>

								<div class="mt-3 flex justify-end">
									<UButton
										color="primary"
										size="xs"
										icon="i-heroicons-arrow-uturn-left"
										:loading="returningLoanId === loan.id"
										@click="returnLoan(loan)"
									>
										Return book
									</UButton>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-else-if="activeTab === 'reservations'">
					<div v-if="activeReservations.length === 0" class="text-sm text-dimmed">
						No active reservations.
					</div>

					<div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div
							v-for="res in activeReservations"
							:key="res.id"
							class="border rounded-lg p-4 flex gap-4"
						>
							<div
								class="w-16 h-24 flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden rounded"
							>
								<img
									v-if="res.imageUrl"
									:src="res.imageUrl"
									alt="cover"
									class="w-full h-full object-cover"
								/>
								<img
									v-else
									:src="'/book-cover.jpg'"
									alt="cover"
									class="w-full h-full object-cover"
								/>
							</div>

							<div class="flex-1 flex flex-col justify-between">
								<div>
									<h3 class="font-semibold text-sm">
										{{ res.bookTitle }}
									</h3>
									<p class="text-xs text-dimmed">
										{{ res.bookAuthorName }} {{ res.bookAuthorSurnameName }}
									</p>
									<p class="text-xs text-dimmed mt-1">
										Reservation date:
										{{ new Date(res.reservationDate).toLocaleString() }}
									</p>
								</div>

								<div class="mt-3 flex justify-end">
									<UButton
										color="error"
										size="xs"
										icon="i-heroicons-x-mark"
										:loading="cancelingReservationId === res.id"
										@click="cancelReservation(res)"
									>
										Cancel reservation
									</UButton>
								</div>
							</div>
						</div>
					</div>

					<div v-if="inactiveReservations.length > 0" class="mt-6 border-t pt-4">
						<p class="text-xs font-medium text-gray-500 mb-2">Inactive / cancelled reservations</p>
						<ul class="space-y-1 text-xs text-dimmed">
							<li v-for="res in inactiveReservations" :key="res.id">
								{{ res.bookTitle }} ·
								{{ new Date(res.reservationDate).toLocaleDateString() }}
							</li>
						</ul>
					</div>
				</div>

				<div v-else-if="activeTab === 'history'">
					<div v-if="returnedLoans.length === 0" class="text-sm text-dimmed">No returns yet.</div>

					<div v-else class="space-y-2 text-sm text-dimmed">
						<div
							v-for="loan in returnedLoans"
							:key="loan.id"
							class="flex justify-between border-b py-2"
						>
							<div>
								<div class="font-medium text-gray-800">
									{{ loan.bookTitle }}
								</div>
								<div class="text-xs">
									{{ loan.bookAuthorName }} {{ loan.bookAuthorSurnameName }}
								</div>
							</div>
							<div class="text-xs text-right">
								<div>
									Loan:
									{{ new Date(loan.loanDate).toLocaleDateString() }}
								</div>
								<div>
									Returned:
									{{ loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : '—' }}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else class="text-sm text-dimmed">No data.</div>
			</div>

			<template #footer>
				<span class="text-xs text-gray-400">
					You can return borrowed books and cancel active reservations from here.
				</span>
			</template>
		</UCard>
	</UContainer>
</template>
