export interface Reservation {
	id: string;
	userId: string;
	username: string;
	bookId: string;
	bookTitle: string;
	imageUrl?: string | null;
	bookAuthorName: string;
	bookAuthorSurnameName: string;
	reservationDate: Date;
	isActive: boolean;
}

export interface ReservationRes {
	reservations: Reservation[];
	amount: number;
}
