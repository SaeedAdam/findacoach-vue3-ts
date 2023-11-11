<template>
    <div>
        <base-dialog :show="!!error" title="An error occurred!" @close="handleError">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <coach-filter @change-filter="setFilters"></coach-filter>
        </section>
        <section>
            <base-card>
                <div class="control">
                    <base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
                    <base-button v-if="!isCoach && !isLoading && isLoggedIn" link to="/register">Register as
                        Coach</base-button>
                    <base-button v-if="!isLoggedIn" link to="/auth?redirect=register">Login to Register as
                        Coach</base-button>
                </div>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <ul v-else-if="hasCoaches">
                    <CoachItem v-for="coach in filteredCoaches" :key="coach.id" :id="coach.id" :first-name="coach.firstName"
                        :last-name="coach.lastName" :areas="coach.areas" :description="coach.description"
                        :rate="coach.rate">
                    </CoachItem>
                </ul>
                <h3 v-else>No coaches found. Please register as a coach.</h3>
            </base-card>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { useCoachStore } from '@/stores/CoachStore';
import { useAuthStore } from '@/stores/AuthStore';

import CoachItem from '@/components/coaches/CoachItem.vue';
import CoachFilter from '@/components/coaches/CoachFilter.vue';
import type { filter } from '@/models/filter.interface';

const isLoading = ref(false);
const error = ref(null);
const activeFilters = ref<filter>({
    frontend: true,
    backend: true,
    career: true
});

const coachStore = useCoachStore();
const authStore = useAuthStore();

const loadCoaches = async (refresh = false) => {
    isLoading.value = true;
    try {
        await coachStore.loadCoaches({ forceRefresh: refresh });
    } catch (error: any) {
        error.value = error.message || 'Something went wrong!';
    }
    isLoading.value = false;
};

onBeforeMount(() => {
    loadCoaches();
});

const filteredCoaches = computed(() => {
    const coaches = coachStore.coaches;

    return coaches.filter(coach => {
        if (!activeFilters.value.frontend && coach.areas.includes('frontend')) {
            return false;
        }
        if (!activeFilters.value.backend && coach.areas.includes('backend')) {
            return false;
        }
        if (!activeFilters.value.career && coach.areas.includes('career')) {
            return false;
        }
        return true;
    });
});

const hasCoaches = computed(() => !isLoading.value && coachStore.hasCoaches);

const isCoach = computed(() => coachStore.isCoach);


const isLoggedIn = computed(() => authStore.isAuthenticated);


const setFilters = (filters: filter) => {
    activeFilters.value = filters;
};



const handleError = () => {
    error.value = null;
};

</script>

<style scoped>
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.controls {
    display: flex;
    justify-content: space-between;
}
</style>