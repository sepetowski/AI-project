<script setup lang="ts">
import { Role } from '~~/enums/roles';
import type { BookDetails } from '~~/types/Book';

const props = defineProps<{
	book: BookDetails;
}>();

const user = await useGetCurrentUser();
const loading = ref(false);

const emit = defineEmits<{
	(e: 'refresh'): void;
}>();

const onLoan = async () => {
	loading.value = true;
	const { error } = await useClientFetch('loans/createLoan', {
		method: 'POST',
		body: {
			userId: user?.id,
			bookId: props.book.id,
		},
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title: 'Book loaned',
				desc: `You have successfully loaned "${props.book.title}".`,
			},
		},
	});

	if (!error.value) emit('refresh');

	loading.value = false;
};

const onReserve = async () => {
	loading.value = true;

	await useClientFetch('reservations/createReservation', {
		method: 'POST',
		body: {
			userId: user?.id,
			bookId: props.book.id,
		},
		successToast: {
			showToastOnSuccess: true,
			toast: {
				title: 'Book reserved',
				desc: `You have successfully made a reservation for "${props.book.title}".`,
			},
		},
	});

	loading.value = false;
};

const publicationYear = computed(() => {
	if (!props.book.publicationDate) return null;
	return new Date(props.book.publicationDate).getFullYear();
});
</script>

<template>
	<div class="mt-24 sm:mt-36">
		<div class="flex flex-col md:flex-row justify-between items-start gap-8">
			<div class="w-full md:w-1/2">
				<h1 class="font-bold text-3xl">
					{{ book.title }}
				</h1>
				<h2 class="md:text-lg font-semibold text-dimmed">
					{{ book.authorName }} {{ book.authorSurname }}
				</h2>

				<div class="mt-4 space-y-4">
					<p class="text-sm md:text-base">
						<span class="font-bold">Book description:</span>
						<span class="ml-1">
							{{ book.bookDescripton || 'No description available.' }}
						</span>
					</p>

					<div class="flex flex-wrap gap-2">
						<UBadge v-for="category in book.categories" :key="category.id" variant="soft" size="sm">
							{{ category.name }}
						</UBadge>
					</div>
				</div>

				<div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
					<div v-if="publicationYear">
						<span class="font-semibold">Year:</span>
						<span class="ml-1">{{ publicationYear }}</span>
					</div>

					<div v-if="book.publicationDate">
						<span class="font-semibold">Publication date:</span>
						<span class="ml-1">
							{{ new Date(book.publicationDate).toISOString().slice(0, 10) }}
						</span>
					</div>

					<div v-if="book.numberOfPage">
						<span class="font-semibold">Pages:</span>
						<span class="ml-1">{{ book.numberOfPage }}</span>
					</div>

					<div v-if="book.availableCopies !== null">
						<span class="font-semibold">Available copies:</span>
						<span class="ml-1">{{ book.availableCopies }}</span>
					</div>
				</div>

				<div class="mt-6 md:mt-8">
					<p :class="book.isAvaible ? 'text-green-400' : 'text-red-400'">
						{{ book.isAvaible ? 'Book is available' : 'Book is not available' }}
					</p>

					<div v-if="user?.role === Role.User" class="mt-4 flex gap-4 items-center">
						<UButton :disabled="loading" v-if="book.isAvaible" @click="onLoan"> Loan </UButton>
						<UButton :disabled="loading" v-if="!book.isAvaible" variant="soft" @click="onReserve">
							Reserve
						</UButton>
					</div>
				</div>

				<div v-if="book.authorDescription || book.authorDateOfBirth" class="mt-8 space-y-2">
					<h3 class="text-lg font-semibold">About the author</h3>

					<p v-if="book.authorDateOfBirth" class="text-sm">
						<span class="font-semibold">Date of birth:</span>
						<span class="ml-1">{{ book.authorDateOfBirth }}</span>
					</p>

					<p v-if="book.authorDescription" class="text-sm whitespace-pre-line">
						{{ book.authorDescription }}
					</p>
				</div>
			</div>

			<div
				class="w-full md:w-1/2 flex items-center justify-center h-[30rem] xl:h-[35rem] overflow-hidden rounded-xl"
			>
				<NuxtImg
					:src="book.imageUrl || '/book-cover.jpg'"
					alt="Book image"
					class="w-full h-full object-cover"
				/>
			</div>
		</div>
	</div>
</template>
