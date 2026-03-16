<!-- UiHomeView.vue -->
<!-- Capa: View Orchestrator — instancia el Impl e inyecta en el Template -->
<!-- Registrado en el router en la ruta /login -->
<template>
  <UiHome v-bind="impl" />
</template>

<script setup lang="ts">
import { useUiHomeImpl } from './use-ui-home-impl'
import UiHome from './UiHome.vue'

const impl = useUiHomeImpl()
</script>
