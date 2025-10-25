import type { SessionData } from '#auth';
import type { Role } from '../enums/roles';

export interface User {
	id: string;
	username: string;
	email: string;
	role: Role;
	firstName: string | null;
	lastName: string | null;
}

export interface AppSession extends SessionData {
	authenticated: boolean;
	user?: User;
}
