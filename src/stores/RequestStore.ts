import { ref } from 'vue'
import {defineStore} from 'pinia'
import { useAuthStore } from './AuthStore'

import type { Request } from '@/models/request.interface'

export const useRequestStore = defineStore('request', () => {
    const requests = ref<Request[]>([])
    const lastFetch = ref<number | null>(null)

    const authStore = useAuthStore();

    const addRequest = (payload: Request) => {
        requests.value.push(payload)
    }

    const setRequests = (payload: Request[]) => {
        requests.value = payload
    }

    const setFetchTimestamp = () => {
        lastFetch.value = new Date().getTime()
    }

    const removeRequest = (payload: string) => {
        requests.value = requests.value.filter(request => request.id !== payload)
    }

    const loadRequests = async () => {
        const coachId = authStore.userId
        const token = authStore.token
        const response = await fetch(`https://vue-http-demo-7a2bd-default-rtdb.europe-west1.firebasedatabase.app/requests/${coachId}.json?auth=${token}`)
        const responseData = await response.json()
        
        if (!response.ok) {
            const error = new Error(responseData.message || 'Failed to fetch requests.')
            throw error
        }

        const requestsArray: Request[] = []

        for (const key in responseData) {
            const request = {
                id: key,
                coachId: coachId,
                userEmail: responseData[key].userEmail,
                message: responseData[key].message
            }
            requestsArray.push(request)
        }

        requests.value = requestsArray
    }

    return { requests, addRequest, setRequests, setFetchTimestamp, removeRequest, loadRequests }
})



/// old code using vuex and javascript

// import mutations from './mutations.js';
// import actions from './actions.js';
// import getters from './getters.js';

// export default {
//     namespaced: true,
//     state() {
//         return {
//             requests: []
//         };
//     },
//     mutations,
//     actions,
//     getters
// }
// export default{
//     addRequest(state, payload){
//         state.requests.push(payload);
//     },
//     setRequests(state, payload){
//         state.requests = payload;
//     },
//     setFetchTimestamp(state){
//         state.lastFetch = new Date().getTime();
//     },
//     removeRequest(state, payload){
//         state.requests = state.requests.filter(request => request.id !== payload);
//     }
// }
// export default {
//     requests(state, _, _2, rootGetters) {
//         const coachId = rootGetters.userId;
//         return state.requests.filter(req => req.coachId === coachId);
//     },
//     hasRequests(_, getters) {
//         return getters.requests && getters.requests.length > 0;
//     }
// };
// export default {
//     async contactCoach(context, payload) {
//         const newRequest = {
//             userEmail: payload.email,
//             message: payload.message
//         };

//         const response = await fetch(`https://vue-http-demo-7a2bd-default-rtdb.europe-west1.firebasedatabase.app/requests/${payload.coachId}.json`, {
//             method: 'POST',
//             body: JSON.stringify(newRequest)
//         });

//         console.log(response);
//         const responseData = await response.json();

//         if (!response.ok) {
//             const error = new Error(responseData.message || 'Failed to send request.');
//             throw error;
//         }

//         newRequest.id = responseData.name;
//         newRequest.coachId = payload.coachId;

//         context.commit('addRequest', newRequest);
//     },
//     acceptRequest(context, payload) {
//         context.commit('addCoachToTeam', payload);
//     },
//     declineRequest(context, payload) {
//         context.commit('removeRequest', payload);
//     },
//     async loadRequests(context) {
//         const coachId = context.rootGetters.userId;
//         const token = context.rootGetters.token;
//         const response = await fetch(`https://vue-http-demo-7a2bd-default-rtdb.europe-west1.firebasedatabase.app/requests/${coachId}.json?auth=${token}`);
//         const responseData = await response.json();
        
//         if (!response.ok) {
//             const error = new Error(responseData.message || 'Failed to fetch requests.');
//             throw error;
//         }

//         const requests = [];

//         for (const key in responseData) {
//             const request = {
//                 id: key,
//                 coachId: coachId,
//                 userEmail: responseData[key].userEmail,
//                 message: responseData[key].message
//             };
//             requests.push(request);
//         }

//         context.commit('setRequests', requests);
//     }
// };