<template>
    <slot />
</template>

<script setup lang="ts">
import { provide } from 'vue';

const { context } = defineProps<{ context: Record<string, unknown> }>();

for (const [key, value] of Object.entries(context)) {
    provide(key, value);
}
</script>
