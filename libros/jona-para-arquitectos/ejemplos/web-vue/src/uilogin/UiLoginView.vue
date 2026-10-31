<!-- UiLoginView.vue — vista: declara como props exactamente el contrato InterUiLogin -->
<script setup lang="ts">
import type { InterUiLogin } from './InterUiLogin';

defineProps<InterUiLogin>();

const valueOf = (event: Event) => (event.target as HTMLInputElement).value;
</script>

<template>
  <form :aria-label="title" @submit.prevent="onSubmit?.()">
    <h1>{{ title }}</h1>
    <p v-if="error" role="alert">{{ error }}</p>
    <input type="email" aria-label="Correo" :value="email" :disabled="isSubmitting"
           @input="onEmailChange?.(valueOf($event))" />
    <input type="password" aria-label="Contraseña" :value="password" :disabled="isSubmitting"
           @input="onPasswordChange?.(valueOf($event))" />
    <button type="submit" :disabled="isSubmitting">{{ submitLabel }}</button>
  </form>
</template>
