<!-- UiIniciarSesion.vue -->
<!-- Capa: Template — componente visual, propiedad del diseñador UI -->
<!-- Restricciones: sin servicios externos, sin navegación, sin storage -->
<template>
  <div class="max-w-sm mx-auto p-4">
    <form class="space-y-2 w-full sm:w-[400px]" @submit.prevent>
      <div class="grid w-full items-center">
        <label for="txtEmail" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <input
          id="txtEmail"
          v-model="email"
          type="email"
          required
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      <div class="grid w-full items-center">
        <label for="txtPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password
        </label>
        <input
          id="txtPassword"
          v-model="password"
          type="password"
          required
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      <div class="w-full">
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          @click="handlerLogin"
        >
          Login
        </button>
      </div>
      <div class="w-full flex gap-2">
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          @click="handlerGoToCreateAccount"
        >
          Create account
        </button>
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          @click="handlerGoToRecoverPassword"
        >
          Recover password
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'

// Props inyectadas desde el View Orchestrator (viene del Impl)
const props = defineProps<{
  email: Ref<string>
  password: Ref<string>
  handlerLogin: () => void
  handlerGoToCreateAccount: () => void
  handlerGoToRecoverPassword: () => void
}>()

// v-model necesita refs directas — las exponemos como computed
const email = props.email
const password = props.password
</script>
