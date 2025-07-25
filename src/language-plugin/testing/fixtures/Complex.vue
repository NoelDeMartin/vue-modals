<template>
    <!-- ... -->
</template>

<script setup lang="ts">
import { defineModal } from '@noeldemartin/vue-modals';

type CustomType = { four: string };

const { close } = defineModal<{
    one: string;
    two: number;
    three: CustomType;
}>();
</script>
