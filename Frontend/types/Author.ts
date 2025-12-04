import type { AuthorSchema } from '../schemas/authors/author';
import type { Book } from './Book';

export interface Author extends AuthorSchema {
	id: string;
}

export interface AuthorsRes {
	authors: Author[];
	amount: number;
}

export interface AuthorDetailsRes extends Author {
	books: Book[];
	amount: number;
}
