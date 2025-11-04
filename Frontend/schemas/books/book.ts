import { z } from 'zod';

export const bookSchema = z.object({
	authorId: z.string({ error: 'Author must be provided' }),

	bookDescripton: z.string().nonempty({ error: 'Book description is required' }),

	title: z.string().nonempty({ error: 'Title is required' }),

	numberOfPage: z
		.number({ error: 'Number of pages must be a number' })
		.min(1, { error: 'Number of pages must be at least 1' })
		.max(5000, { error: 'Number of pages must be at most 5000' }),

	publicationDate: z.iso
		.date({ error: 'Publication date must be a valid date-time string' })
		.refine((val) => new Date(val) < new Date(), {
			message: 'Publication date must be earlier than today',
		}),
	imageFile: z.any().optional(),

	availableCopies: z
		.number({ error: 'Available copies must be a number' })
		.min(0, { error: 'Available copies must be at least 0' })
		.max(100, { error: 'Available copies must be at most 100' }),

	categoriesIds: z.array(z.string()).optional(),
});

export type BookSchema = z.output<typeof bookSchema>;
