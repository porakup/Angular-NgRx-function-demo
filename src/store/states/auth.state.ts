export interface AuthState {
    userId: string;
    username: string;
    profile: string;
    accessToken: string;
    isLoggedIn: boolean;
}

export const initialAuthState: AuthState = {
    userId: null,
    username: null,
    profile: null,
    accessToken: null,
    isLoggedIn: false
};
