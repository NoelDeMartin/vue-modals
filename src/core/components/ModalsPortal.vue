<template>
    <div>
        <slot name="overlay" :show="modals.length > 0" />
        <ModalContext v-for="modal of modals" :key="modal.id" :controller="modal">
            <component :is="modal.component" v-bind="modal.props" @close="modal.close($event)" />
        </ModalContext>
    </div>
</template>

<script setup lang="ts">
import { modals } from '@noeldemartin/vue-modals/state';

import ModalContext from './ModalContext.vue';
</script>
