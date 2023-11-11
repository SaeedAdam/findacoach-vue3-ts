<template>
  <the-header></the-header>
  <router-view v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore';

import TheHeader from '@/components/layout/TheHeader.vue';

const router = useRouter();
const authStore = useAuthStore();

const didAutoLogout = computed(() => authStore.didAutoLogout);

watch(didAutoLogout, isLoggedOut => {
  if (isLoggedOut) {
    router.replace('/auth');
  }
});

authStore.tryLogin();
</script>

<style scoped></style>
