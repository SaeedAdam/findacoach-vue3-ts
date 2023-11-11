import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './AuthStore'

import type { Coach } from '@/models/coach.interface';

export const useCoachStore = defineStore('coach', () => {
    const coaches = ref<Coach[]>([])
    const lastFetch = ref<number | null>(null)

    const authStore = useAuthStore();

    const registerCoach = (payload: Coach) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        const response = fetch(`https://vue-http-demo-7a2bd-default-rtdb.europe-west1.firebasedatabase.app/coaches/${userId}.json?auth=${token}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const error = new Error(response.statusText || 'Failed to register coach.')
            throw error
        }

        setCoaches([...coaches.value, payload])
    }

    const setCoaches = (payload: Coach[]) => {
        coaches.value = payload
    }

    const setFetchTimestamp = () => {
        lastFetch.value = new Date().getTime()
    }

    const isCoach = computed(() => {
        const userId = authStore.userId
        return coaches.value.some(coach => coach.id === userId)
    })

    const hasCoaches = computed(() => {
        return coaches.value && coaches.value.length > 0
    })

    const loadCoaches = async (payload: { forceRefresh: boolean }) => {
        if (!payload.forceRefresh && !shouldUpdate.value) {
            return
        }

        const response = await fetch(`https://vue-http-demo-7a2bd-default-rtdb.europe-west1.firebasedatabase.app/coaches.json`)
        const responseData = await response.json()

        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch coaches.')
            throw error
        }

        const coachesArray: Coach[] = []

        for (const key in responseData) {
            const coach = {
                id: key,
                firstName: responseData[key].firstname,
                lastName: responseData[key].lastname,
                description: responseData[key].description,
                rate: responseData[key].rate,
                areas: responseData[key].areas
            }
            coachesArray.push(coach)
        }

        coaches.value = coachesArray
        setFetchTimestamp()
    }

    const shouldUpdate = computed(() => {
        const lastFetchTimestamp = lastFetch.value
        if (!lastFetchTimestamp) {
            return true
        }
        const currentTimeStamp = new Date().getTime()
        return (currentTimeStamp - lastFetchTimestamp) / 1000 > 60
    })

    return { coaches, registerCoach, setCoaches, setFetchTimestamp, loadCoaches, shouldUpdate, isCoach, hasCoaches }
});