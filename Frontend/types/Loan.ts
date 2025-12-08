export interface Loan {
	id: string;
	userId: string;
	username: string;
	bookId: string;
	bookTitle: string;
	imageUrl?: string | null;
	bookAuthorName: string;
	bookAuthorSurnameName: string;
	loanDate: Date;
	returnDate?: Date | null;
}

export interface LoanRes {
	loans: Loan[];
	amount: number;
}
