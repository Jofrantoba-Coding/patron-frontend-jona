<!-- UiHomeSession.vue -->
<!-- Capa: Template — componente visual de la vista de sesión -->
<!-- Restricciones: sin servicios externos, sin navegación, sin storage -->
<template>
  <BorderLayout>
    <template #north><Header /></template>
    <template #center>
      <div class="max-w-sm mx-auto p-4 space-y-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          Welcome, {{ name }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Active session: {{ email }}
        </p>
        <button
          class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </template>
    <template #south><Footer /></template>
  </BorderLayout>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import BorderLayout from '../../uilayouts/BorderLayout.vue'
import Header from '../../uiutils/Header.vue'
import Footer from '../../uiutils/Footer.vue'

defineProps<{
  name: Ref<string>
  email: Ref<string>
  logout: () => void
}>()
</script>
