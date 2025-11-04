import { z } from 'zod';

export const passwordSchema = z
	.string()
	.nonempty({ error: 'Password is required' })
	.min(8, { error: 'At least 8 characters long' })
	.regex(/[a-z]/, { error: 'Must contain at least one lowercase letter' })
	.regex(/[A-Z]/, { error: 'Must contain at least one uppercase letter' })
	.regex(/\d/, { error: 'Must contain at least one digit' });
