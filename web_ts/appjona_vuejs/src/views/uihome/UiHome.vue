<!-- UiHome.vue -->
<!-- Capa: Template — layout visual de la vista Home -->
<!-- Restricciones: sin servicios externos, sin navegación, sin storage -->
<template>
  <BorderLayout>
    <template #north><Header /></template>
    <template #center>
      <UiIniciarSesion
        :email="email"
        :password="password"
        :handler-login="handlerLogin"
        :handler-go-to-create-account="handlerGoToCreateAccount"
        :handler-go-to-recover-password="handlerGoToRecoverPassword"
      />
    </template>
    <template #south><Footer /></template>
  </BorderLayout>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import BorderLayout from '../../uilayouts/BorderLayout.vue'
import Header from '../../uiutils/Header.vue'
import Footer from '../../uiutils/Footer.vue'
import UiIniciarSesion from '../uiiniciarsesion/UiIniciarSesion.vue'

defineProps<{
  email: Ref<string>
  password: Ref<string>
  handlerLogin: () => void
  handlerGoToCreateAccount: () => void
  handlerGoToRecoverPassword: () => void
}>()
</script>
