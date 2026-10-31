<script setup lang="ts">
import { ref } from 'vue';
import type { InterAuthService, LoginResult } from './services/InterAuthService';
import { UiLogin } from './uilogin';

defineProps<{ service: InterAuthService }>();
const session = ref<LoginResult | undefined>();
</script>

<template>
  <main>
    <template v-if="session">
      <h1>Hola, {{ session.user.nombre }}</h1>
      <button type="button" @click="session = undefined">Cerrar sesión</button>
    </template>
    <UiLogin v-else :service="service" @authenticated="session = $event" />
  </main>
</template>
