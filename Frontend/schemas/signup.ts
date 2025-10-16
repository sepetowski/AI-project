import { z } from 'zod';
import { Role } from '../enums/roles';
import { passwordSchema } from './password';

export const signupSchema = z
	.object({
		username: z
			.string()
			.nonempty({ error: 'Username is required' })
			.min(4, 'Username must be at least 4 characters')
			.max(30, 'Username must be at most 30 characters'),

		email: z.email('Invalid email address'),

		password: passwordSchema,

		confirmPassword: z.string().nonempty({ error: 'Please confirm your password' }),

		firstName: z.string().optional().nullable(),

		lastName: z.string().optional().nullable(),

		role: z.enum(Role).default(Role.User),

		adminRoleKey: z.string().optional().nullable(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type SignupSchema = z.output<typeof signupSchema>;
