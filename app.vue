<script setup lang="ts">
import {initializeApiKeys} from "./composables/useApi";

initializeApiKeys();
</script>

<template>
  <NuxtLayout>
      <div class="settings">Настройки</div>
      <NuxtPage />
  </NuxtLayout>
</template>
