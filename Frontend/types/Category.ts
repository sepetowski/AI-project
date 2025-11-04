import type { CategorySchema } from '../schemas/category/category';

export interface Category extends CategorySchema {
	id: string;
}

export interface CategoriesRes {
	categories: Category[];
	amount: number;
}

export interface CategoryDetailsRes extends Category {
	amount: number;
}
