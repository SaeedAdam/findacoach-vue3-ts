<template>
    <base-card>
        <h2>Find Your Coach</h2>
        <span class="filter-option">
            <input type="checkbox" id="frontend" checked @change="setFilter" />
            <label for="frontend">Frontend</label>
        </span>
        <span class="filter-option">
            <input type="checkbox" id="backend" checked @change="setFilter" />
            <label for="backend">Backend</label>
        </span>
        <span class="filter-option">
            <input type="checkbox" id="career" checked @change="setFilter" />
            <label for="career">Career</label>
        </span>
    </base-card>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import type { filter } from '@/models/filter.interface';

const emit = defineEmits(['change-filter']);

const filters = ref<filter>({
    frontend: true,
    backend: true,
    career: true
});

const setFilter = (event : Event) => {
    const inputId = (event.target as HTMLInputElement).id;
    const isActive = (event.target as HTMLInputElement).checked;
    const updatedFilters = {
        ...filters.value,
        [inputId]: isActive
    };
    filters.value = updatedFilters;
    emit('change-filter', updatedFilters);
};
</script>

<style scoped>
h2 {
    margin: 0.5rem 0;
}

.filter-option {
    margin-right: 1rem;
}

.filter-option label,
.filter-option input {
    vertical-align: middle;
}

.filter-option label {
    margin-left: 0.25rem;
}

.filter-option.active label {
    font-weight: bold;
}

.filter-option.active input {
    border-color: #3a0061;
    background-color: #3a0061;
}

.filter-option.active label {
    color: white;
}

.filter-option input {
    border: 1px solid #ccc;
    background-color: #ccc;
    border-radius: 30px;
    padding: 0.5rem 1rem;
    cursor: pointer;
}

.filter-option input:hover,
.filter-option input:active {
    border-color: #3a0061;
}

.filter-option input:checked {
    border-color: #3a0061;
    background-color: #3a0061;
}

.filter-option input:checked:hover,
.filter-option input:checked:active {
    border-color: #270041;
    background-color: #270041;
}

.filter-option input:checked+label {
    color: rgb(88, 9, 161);
}

.filter-option input:checked+label:hover,
.filter-option input:checked+label:active {
    color: #edd2ff;
}

.filter-option input:focus {
    outline: none;
}

@media (max-width: 768px) {
    .filter-option {
        display: block;
        margin: 0.5rem 0;
    }
}
</style>