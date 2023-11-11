<template>
    <div>
        <base-dialog :show="!!error" title="An error occurred!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <header>
                    <h2>Requests Received</h2>
                </header>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <ul v-else-if="hasRequests">
                    <request-item v-for="request in requests" :key="request.id" :id="request.id" :coach-id="request.coachId"
                        :email="request.userEmail" :message="request.message" />
                </ul>
                <h3 v-else>You haven't received any requests yet!</h3>
            </base-card>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRequestStore } from '@/stores/RequestStore';

import RequestItem from '../../components/requests/RequestItem.vue';

const requestStore = useRequestStore();

const isLoading = ref(false);
const error = ref(null);

const requests = computed(() => requestStore.requests);

const hasRequests = computed(() => requests.value && requests.value.length > 0);

const loadRequests = async () => {
    isLoading.value = true;
    try {
        await requestStore.loadRequests();
    } catch (error: any) {
        error.value = error.message || 'Something went wrong!';
    }
    isLoading.value = false;
};

const handleError = () => {
    error.value = null;
};

loadRequests();
</script>

<style scoped>
header {
    text-align: center;
}

ul {
    list-style: none;
    margin: 2rem auto;
    padding: 0;
    max-width: 30rem;
}

h3 {
    text-align: center;
}
</style>