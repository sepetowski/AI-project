import { z } from 'zod';

export const newAuthorSchema = z.object({
	name: z
		.string()
		.nonempty({ message: 'Name is required' })
		.max(100, { message: 'Name must be at most 100 characters' }),

	surname: z
		.string()
		.nonempty({ message: 'Surname is required' })
		.max(100, { message: 'Surname must be at most 100 characters' }),

	description: z
		.string()
		.max(1000, { message: 'Description must be at most 1000 characters' })
		.optional(),

	dateOfBirth: z.string().optional(),
});

export type NewAuthorSchema = z.output<typeof newAuthorSchema>;
