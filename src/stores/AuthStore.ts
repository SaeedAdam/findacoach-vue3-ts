import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import type { User } from '@/models/user.interface';


export const useAuthStore = defineStore('auth', () => {

    const user = ref<User>({
        userId: null,
        token: null,
        didAutoLogout: false
    })

    let timer: any;


    const setUser = (payload: User) => {
        user.value = payload;
    }

    const setAutoLogout = () => {
        user.value.didAutoLogout = true;
    }

    const setLogout = () => {
        user.value = {
            userId: null,
            token: null,
            didAutoLogout: false
        }
    }

    const userId = computed(() => {
        return user.value.userId;
    })

    const token = computed(() => {
        return user.value.token;
    })

    const isAuthenticated = computed(() => {
        return !!user.value.token;
    })

    const didAutoLogout = computed(() => {
        return user.value.didAutoLogout;
    })

    const auth = async (payload: { mode: string, email: string, password: string }) => {
        const mode = payload.mode;
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

        if (mode === 'signup') {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
        }

        const response = await fetch(`${url}AIzaSyD6eL4pklLdBLEUDFztAVCtwhWtxr8NgSA`, {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true,
            }),
        });

        const responseData = await response.json();
        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
            throw error;
        }

        const expiresIn = +responseData.expiresIn * 1000;
        const expirationDate = new Date().getTime() + expiresIn;

        localStorage.setItem('token', responseData.idToken);
        localStorage.setItem('userId', responseData.localId);
        localStorage.setItem('tokenExpiration', expirationDate.toString());

        timer = setTimeout(function () {
            setAutoLogout();
        }, expiresIn);

        setUser({
            token: responseData.idToken,
            userId: responseData.localId,
            didAutoLogout: false,
        });
    }

    const signup = async (payload: { email: string, password: string }) => {
        return auth({
            ...payload,
            mode: 'signup',
        });
    }

    const login = async (payload: { email: string, password: string }) => {
        return auth({
            ...payload,
            mode: 'login',
        });
    }

    const tryLogin = () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const expiresIn = +tokenExpiration! - new Date().getTime();

        if (expiresIn < 0) {
            return;
        }

        timer = setTimeout(function () {
            setAutoLogout();
        }, expiresIn);

        setUser({
            token: token,
            userId: userId,
            didAutoLogout: false,
        });
    }

    const autoLogout = () => {
        logout();
        setAutoLogout();
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');

        clearTimeout(timer);

        setLogout();
    }

    return { user, setUser, setAutoLogout, setLogout, userId, token, isAuthenticated, didAutoLogout, auth, signup, login, tryLogin, autoLogout, logout }
});