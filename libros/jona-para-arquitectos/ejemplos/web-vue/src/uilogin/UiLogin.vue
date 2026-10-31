<!-- UiLogin.vue — entrada -->
<script setup lang="ts">
import { reactive } from 'vue';
import type { InterAuthService, LoginResult } from '../services/InterAuthService';
import { UILOGIN_DEFAULTS } from './InterUiLogin';
import UiLoginView from './UiLoginView.vue';
import { useUiLoginImpl } from './useUiLoginImpl';

const props = defineProps<{ service: InterAuthService }>();
const emit = defineEmits<{ authenticated: [result: LoginResult] }>();

// reactive() desenvuelve las referencias, de modo que la vista recibe valores y no objetos ref.
const impl = reactive({
  ...UILOGIN_DEFAULTS,
  ...useUiLoginImpl(props.service, (result) => emit('authenticated', result)),
});
</script>

<template>
  <UiLoginView v-bind="impl" />
</template>
