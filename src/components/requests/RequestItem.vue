<template>
  <li>
    <div>
      <a :href="emailLink">{{ email }}</a>
    </div>
    <p>{{ message }}</p>
  </li>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: false
  },
  coachId: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const messageSubject = 'Your coach has responded to your request!';
const messageBody = `
Hi ${props.email},

Thank you for your request! I will get back to you as soon as possible.

Best regards,
${props.coachId}
`

const email = computed(() => props.email);

const message = computed(() => props.message);

const emailLink = computed(() => `mailto:${props.email}?subject=${messageSubject}&body=${messageBody}`);

</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #ccc;
  padding: 1rem;
}

a {
  color: #3d008d;
  text-decoration: none;
  font-weight: bold;
}

a:hover,
a:active {
  color: #8d007a;
}

p {
  margin: 0.5rem 0 0 0;
}
</style>