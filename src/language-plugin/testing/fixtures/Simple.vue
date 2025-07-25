<template>
    <!-- ... -->
</template>

<script setup lang="ts">
import { defineModal } from '@noeldemartin/vue-modals';

const { close } = defineModal<{ lorem: 'ipsum' }>();
</script>
