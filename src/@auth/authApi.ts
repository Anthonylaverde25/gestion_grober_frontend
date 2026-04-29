import { User } from '@auth/user';
import UserModel from '@auth/user/models/UserModel';
import { PartialDeep } from 'type-fest';
import api from '@/utils/api';

type AuthResponse = {
	user: User;
	access_token: string;
};

/**
 * Refreshes the access token
 */
export async function authRefreshToken(): Promise<Response> {
        return api.post('v1/auth/refresh', {
                retry: 0 // Don't retry refresh token requests
        });
}

/**
 * Sign in with token
 */
export async function authSignInWithToken(accessToken: string): Promise<Response> {
        return api.get('user', {
                headers: { Authorization: `Bearer ${accessToken}` }
        });
}

/**
 * Sign in
 */
export async function authSignIn(credentials: { email: string; password: string }): Promise<AuthResponse> {
        const response: any = await api
                .post('v1/auth/login', {
                        json: credentials
                })
                .json();
        const data = response.data ? response.data : response;
        if (data && data.user) {
                data.user = UserModel(data.user);
        }
        return data;
}

/**
 * Sign up
 */
export async function authSignUp(dataPayload: {
        displayName: string;
        email: string;
        password: string;
}): Promise<AuthResponse> {
        const response: any = await api
                .post('v1/auth/register', {
                        json: dataPayload
                })
                .json();
        const data = response.data ? response.data : response;
        if (data && data.user) {
                data.user = UserModel(data.user);
        }
        return data;
}

/**
 * Sign out
 */
export async function authSignOut(): Promise<Response> {
        return api.post('v1/auth/logout');
}

/**
 * Switches the active company context
 */
export async function authSwitchCompany(companyId: string): Promise<any> {
        return api.post('v1/auth/switch-context', {
                json: { company_id: companyId }
        }).json();
}

/**
 * Get user by id
 */
export async function authGetDbUser(userId: string): Promise<User> {
        return api.get(`v1/users/${userId}`).json();
}

/**
 * Get user by email
 */
export async function authGetDbUserByEmail(email: string): Promise<User> {
        return api.get(`v1/users/email/${email}`).json();
}

/**
 * Update user
 */
export function authUpdateDbUser(user: PartialDeep<User>): Promise<Response> {
        return api.put(`v1/users/${user.id}`, {
                json: UserModel(user)
        });
}
/**
 * Create user
 */
export async function authCreateDbUser(user: PartialDeep<User>): Promise<User> {
	return api
		.post('mock/users', {
			json: UserModel(user)
		})
		.json();
}
