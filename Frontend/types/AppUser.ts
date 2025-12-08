export interface AppUser {
	id: string;
	createdAt: Date;
	email: string;
	username: string;
	firstName?: string | null;
	lastName?: string | null;
}

export interface AppUserRes {
	users: AppUser[];
	amount: number;
}
