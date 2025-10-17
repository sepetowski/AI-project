import { z } from 'zod';

export const passwordSchema = z
	.string()
	.nonempty({ error: 'Password is required' })
	.min(8, { message: 'At least 8 characters long' })
	.regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
	.regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
	.regex(/\d/, { message: 'Must contain at least one digit' });
