<template>
    <form @submit.prevent="sendMessage">
        <div class="form-control">
            <label for="email">Youe E-Mail</label>
            <input type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
            <label for="message">Message</label>
            <textarea name="" id="message" rows="5" v-model.trim="message"></textarea>
        </div>
        <p v-if="!formIsValid">Please enter a valid email and non-empty message.</p>
        <div class="actions">
            <base-button type="submit">Send Message</base-button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRequestStore } from '@/stores/RequestStore';

import type { Request } from '@/models/request.interface';

const requestStore = useRequestStore();
const router = useRouter();

const email = ref('');
const message = ref('');
const formIsValid = ref(true);

const sendMessage = () => {
    formIsValid.value = true;
    if (email.value === '' || !email.value.includes('@') || message.value === '') {
        formIsValid.value = false;
    }
    if (!formIsValid.value) {
        return;
    }
    
    requestStore.addRequest({
        coachId: router.currentRoute.value.params.id,
        userEmail: email.value,
        message: message.value
    } as Request);
    
    router.replace('/coaches');
};
</script>



<style scoped>
form {
    margin: 1rem;
    border: 1px solid #ccc;
    border-radius: 12px;
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
    color: red;
}

.actions {
    text-align: center;
}
</style>