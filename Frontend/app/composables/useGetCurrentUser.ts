import type { AppSession, User } from '~~/types/AppSession';

export async function useGetCurrentUser(): Promise<User | null> {
	const { getSession } = useAuth();

	const session = (await getSession()) as AppSession | null;

	if (!session || !session.authenticated || !session.user) {
		return null;
	}

	return session.user;
}
