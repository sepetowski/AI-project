import { z } from 'zod';

export const categorySchema = z.object({
	name: z
		.string()
		.nonempty({ error: 'Name is required' })
		.min(4, { error: 'Name must be at least 4 characters' })
		.max(50, { error: 'Name must be at most 50 characters' }),
});

export type CategorySchema = z.output<typeof categorySchema>;
