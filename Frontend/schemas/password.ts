import { z } from 'zod';

export const passwordSchema = z
	.string()
	.nonempty({ error: 'Password is required' })
	.superRefine((value, ctx) => {
		if (value.length < 8) {
			ctx.addIssue({
				code: 'custom',
				error: 'At least 8 characters long',
			});
		}
		if (!/[a-z]/.test(value)) {
			ctx.addIssue({
				code: 'custom',
				error: 'Must contain at least one lowercase letter',
			});
		}
		if (!/[A-Z]/.test(value)) {
			ctx.addIssue({
				code: 'custom',
				error: 'Must contain at least one uppercase letter',
			});
		}
		if (!/\d/.test(value)) {
			ctx.addIssue({
				code: 'custom',
				error: 'Must contain at least one digit',
			});
		}
	});
