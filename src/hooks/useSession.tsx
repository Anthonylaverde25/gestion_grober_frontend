import { User } from "@auth/user";
import useAuth from "@fuse/core/FuseAuthProvider/useAuth";

interface SessionContextType {
    isAuth: boolean;
    user: User | null;
}

export default function useSession(): SessionContextType {
    const { authState: { authStatus, isAuthenticated, user } = {} as any } = useAuth();

    return {
        isAuth: isAuthenticated ? authStatus === 'authenticated' : false,
        user: user as User
    };
}