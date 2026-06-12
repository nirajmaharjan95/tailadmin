import { useUser } from "@clerk/clerk-react";
import { useMemo } from "react";

interface ClerkUser {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
    emailAddresses: { emailAddress: string }[];
}

// Note: Clerk's client SDK doesn't allow fetching other users by ID
// This hook returns the current logged-in user
export const useCurrentUser = () => {
    const { user, isLoaded } = useUser();

    const currentUser: ClerkUser | null = useMemo(() => {
        if (!user) return null;
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            emailAddresses: user.emailAddresses.map(e => ({ emailAddress: e.emailAddress }))
        };
    }, [user]);

    return { currentUser, isLoaded };
};
