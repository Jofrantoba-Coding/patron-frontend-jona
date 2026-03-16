<!-- BorderLayout.vue — Layout de 5 zonas (north/south/east/west/center) -->
<template>
  <div class="border-layout">
    <div v-if="$slots.north" class="border-layout-north">
      <slot name="north" />
    </div>
    <div class="border-layout-middle">
      <div v-if="$slots.west" class="border-layout-west">
        <slot name="west" />
      </div>
      <div class="border-layout-center">
        <slot name="center" />
      </div>
      <div v-if="$slots.east" class="border-layout-east">
        <slot name="east" />
      </div>
    </div>
    <div v-if="$slots.south" class="border-layout-south">
      <slot name="south" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Sin lógica — layout puro
</script>

<style scoped>
.border-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.border-layout-north,
.border-layout-south {
  flex: 0 1 auto;
  text-align: center;
  font-size: 1.5em;
}
.border-layout-middle {
  display: flex;
  flex: 1 1 auto;
}
.border-layout-west,
.border-layout-east {
  flex: 0 1 auto;
}
.border-layout-center {
  flex: 1 1 auto;
  overflow: auto;
}
</style>
