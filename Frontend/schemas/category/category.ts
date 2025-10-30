import { z } from 'zod';

export const categorySchema = z.object({
	name: z
		.string()
		.nonempty({ message: 'Name is required' })
		.min(4, { message: 'Name must be at least 4 characters' })
		.max(50, { message: 'Name must be at most 50 characters' }),
});

export type CategorySchema = z.output<typeof categorySchema>;
