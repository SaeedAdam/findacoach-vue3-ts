<template>
    <div>
        <base-dialog :show="!!error" title="An error occured" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <base-dialog :show="isLoading" title="Authenticating..." fixed>
            <base-spinner></base-spinner>
        </base-dialog>
        <base-card>
            <form @submit.prevent="submitForm">
                <div class="form-control" :class="{ errors: !emailIsValid }">
                    <label for="email">Your E-Mail</label>
                    <input type="email" id="email" v-model.trim="email" @input="clearValidity('email')">
                    <small v-if="!emailIsValid">Please enter a valid email address!</small>
                </div>
                <div class="form-control" :class="{ errors: !passwordIsValid }">
                    <label for="password">Your Password</label>
                    <input type="password" id="password" v-model.trim="password" @input="clearValidity('password')">
                    <small v-if="!passwordIsValid">Please enter a valid password! (must be at least 6 characters
                        long)</small>
                </div>
                <base-button>{{ submitButtonCaption }}</base-button>
                <base-button mode="outline" type="button" @click="switchAuthMode">{{ switchModeButtonCaption
                }}</base-button>
            </form>
        </base-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore';

const userStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const emailIsValid = ref(true);
const passwordIsValid = ref(true);
const mode = ref('login');
const isLoading = ref(false);
const error = ref(null);

const submitButtonCaption = computed(() => mode.value === 'login' ? 'Login' : 'Sign Up');

const switchModeButtonCaption = computed(() => mode.value === 'login' ? 'Switch to Sign Up' : 'Switch to Login');

const submitForm = async () => {
    emailIsValid.value = true;
    passwordIsValid.value = true;
    if (email.value === '' || !email.value.includes('@')) {
        emailIsValid.value = false;
    }
    if (password.value === '' || password.value.length < 6) {
        passwordIsValid.value = false;
    }
    if (!emailIsValid.value || !passwordIsValid.value) {
        return;
    }
    const authData = {
        email: email.value,
        password: password.value
    };
    isLoading.value = true;
    if (mode.value === 'login') {
        try {
            await userStore.login(authData);
            const redirectUrl = router.currentRoute.value.query.redirect || '/coaches';
            router.replace(redirectUrl as string);

        } catch (error: any) {
            isLoading.value = false;
            error.value = error.message || 'Failed to login!';
        }
    } else {
        try {
            await userStore.signup(authData);
            const redirectUrl = router.currentRoute.value.query.redirect || '/coaches';
            router.replace(redirectUrl as string);

        } catch (error: any) {
            isLoading.value = false;
            error.value = error.message || 'Failed to sign up!';
        }
    }
};

const switchAuthMode = () => {
    mode.value = mode.value === 'login' ? 'signup' : 'login';
};

const clearValidity = (input: string) => {
    if (input === 'email') {
        emailIsValid.value = true;
    } else if (input === 'password') {
        passwordIsValid.value = true;
    }
};

const handleError = () => {
    error.value = null;
};
</script>

<style scoped>
form {
    margin: 1rem;
    padding: 1rem;
}

.form-control {
    margin: 0.5rem 0;
}

label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
}

input,
textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.15rem;
}

input:focus,
textarea:focus {
    border-color: #3d008d;
    background-color: #faf6ff;
    outline: none;
}

.errors {
    font-weight: bold;
    color: rgb(155, 28, 28);
}
</style>