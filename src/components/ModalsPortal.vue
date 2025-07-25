<template>
    <div v-if="modals.length">
        <Provide v-for="modal of modals" :key="modal.id" :context="{ modal }">
            <component :is="modal.component" v-bind="modal.props" />
        </Provide>
    </div>
</template>

<script setup lang="ts">
import { modals } from '@noeldemartin/vue-modals/lib/modals';

import Provide from './_internals/Provide.vue';
</script>
