<template>
    <div :data-open="modals.length ? 'true' : undefined">
        <slot name="overlay" :show="modals.length > 0" />
        <ModalComponent v-if="!nested" v-for="modal of modals" :key="modal.id" :is="modal" />
        <ModalComponent v-else-if="modals[0]" :is="modals[0]" />
    </div>
</template>

<script setup lang="ts">
import { modals } from '@noeldemartin/vue-modals/state';
import ModalComponent from './ModalComponent.vue';

const { nested = false } = defineProps<{ nested?: boolean }>();
</script>
