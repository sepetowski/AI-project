import type { Category } from './Category';

export interface Book {
	id: string;
	authorId: string;
	authorName: string;
	authorSurname: string;
	categories: Category[];
	imageUrl: string | null;
	isAvaible: boolean;
	title: string;
}

export interface BooksRes {
	books: Book[];
	amount: number;
}

export interface BookDetails extends Book {
	bookDescripton: string;
	numberOfPage: number;
	publicationDate: string;
	availableCopies: number | null;
	authorDescription?: string | null;
	authorDateOfBirth?: string | null;
}
