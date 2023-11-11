export interface User {
    userId: string | null;
    token: string | null;
    didAutoLogout: boolean;
}