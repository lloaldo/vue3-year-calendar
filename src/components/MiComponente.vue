<script setup lang="ts">
defineProps<{
  mensaje: string;
  mensaje2: string;
}>();
</script>

<template>
  <div>{{ mensaje }}{{ mensaje2 }}</div>
</template>