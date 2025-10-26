import { z } from 'zod';
import { passwordSchema } from './password';

export const signinSchema = z.object({
	username: z
		.string()
		.nonempty({ error: 'Username is required' })
		.min(4, 'Username must be at least 4 characters')
		.max(30, 'Username must be at most 30 characters'),

	password: passwordSchema,
});

export type SigninSchema = z.output<typeof signinSchema>;
