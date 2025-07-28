<template>
    <div>
        <slot name="overlay" :show="modals.length > 0" />
        <ModalContext v-if="!nested" v-for="modal of modals" :key="modal.id" :controller="modal">
            <component :is="modal.component" v-bind="modal.props" @close="modal.close($event)" />
        </ModalContext>
        <ModalContext v-else-if="modals[0]" :controller="modals[0]">
            <component :is="modals[0].component" v-bind="modals[0].props" @close="modals[0].close($event)" />
        </ModalContext>
    </div>
</template>

<script setup lang="ts">
import { modals } from '@noeldemartin/vue-modals/state';

import ModalContext from './ModalContext.vue';

const { nested = false } = defineProps<{ nested?: boolean }>();
</script>
