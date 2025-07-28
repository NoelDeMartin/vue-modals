<template>
    <slot />
</template>

<script setup lang="ts" generic="T extends object = never">
import { provideModalController } from '@noeldemartin/vue-modals/composition';
import type { ModalController } from '@noeldemartin/vue-modals/state';

const { controller } = defineProps<{ controller: ModalController<T> }>();

provideModalController(controller);
</script>
