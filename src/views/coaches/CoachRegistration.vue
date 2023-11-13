<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCoachStore } from '@/stores/CoachStore';

import type { Coach } from '@/models/coach.interface';
import CoachForm from '@/components/coaches/CoachForm.vue';

const coachStore = useCoachStore();
const router = useRouter();

const saveData = (data: Coach) => {
    coachStore.registerCoach(data);
    router.replace('/coaches');
};
</script>


<template>
    <section>
        <base-card>
            <h2>Register as a coach now!</h2>
            <coach-form @save-form="saveData"></coach-form>
        </base-card>
    </section>
</template>