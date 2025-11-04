import { z } from 'zod';

export const authorSchema = z.object({
	name: z
		.string()
		.nonempty({ error: 'Name is required' })
		.max(100, { error: 'Name must be at most 100 characters' }),

	surname: z
		.string()
		.nonempty({ error: 'Surname is required' })
		.max(100, { error: 'Surname must be at most 100 characters' }),

	description: z
		.string()
		.max(1000, { error: 'Description must be at most 1000 characters' })
		.optional(),

	dateOfBirth: z.string().optional(),
});

export type AuthorSchema = z.output<typeof authorSchema>;
