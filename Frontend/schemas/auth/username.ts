import { z } from 'zod';

export const usernameSchema = z
	.string()
	.nonempty({ error: 'Username is required' })
	.min(4, 'Username must be at least 4 characters')
	.max(30, 'Username must be at most 30 characters');
