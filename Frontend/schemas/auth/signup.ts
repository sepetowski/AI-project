import { z } from 'zod';
import { Role } from '../../enums/roles';
import { passwordSchema } from './password';
import { usernameSchema } from './username';

export const signupSchema = z
	.object({
		username: usernameSchema,

		email: z.email('Invalid email address'),

		password: passwordSchema,

		confirmPassword: z.string().nonempty({ error: 'Please confirm your password' }),

		role: z.enum(Role).default(Role.User),

		adminRoleKey: z.string().optional().nullable(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type SignupSchema = z.output<typeof signupSchema>;
