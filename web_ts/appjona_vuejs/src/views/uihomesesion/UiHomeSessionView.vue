<!-- UiHomeSessionView.vue -->
<!-- Capa: View Orchestrator — instancia el Impl e inyecta en el Template -->
<!-- Registrado en el router en la ruta /homesesion -->
<template>
  <UiHomeSession v-bind="impl" />
</template>

<script setup lang="ts">
import { useUiHomeSessionImpl } from './use-ui-home-session-impl'
import UiHomeSession from './UiHomeSession.vue'

const impl = useUiHomeSessionImpl()
</script>
