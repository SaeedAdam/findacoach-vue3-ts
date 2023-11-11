<template>
    <li>
        <h3>{{ fullName }}</h3>
        <h4>${{ rate }}</h4>
        <div>
            <base-badge v-for="area in areas" :key="area" :title="area" :type="area">
            </base-badge>
        </div>
        <div class="actions">
            <base-button mode="outline" link :to="coachContactLink">Contact</base-button>
            <base-button link :to="coachDetailsLink">View Details</base-button>
        </div>
    </li>
</template>


<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    areas: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    }
});

const router = useRoute();

const fullName = computed(() => `${props.firstName} ${props.lastName}`);

const areas = computed(() => props.areas);

const rate = computed(() => props.rate);

const coachContactLink = computed(() => `${router.path}/${props.id}/contact`); // /coaches/c1/contact

const coachDetailsLink = computed(() => `${router.path}/${props.id}`); // /coaches/c1

</script>

<style scoped>
li {
    margin: 1rem 0;
    border: 1px solid #424242;
    border-radius: 12px;
    padding: 1rem;
}

h3 {
    font-size: 1.5rem;
}

h3,
h4 {
    margin: 0.5rem 0;
}

div {
    margin: 0.5rem 0;
}

.actions {
    display: flex;
    justify-content: flex-end;
}
</style>