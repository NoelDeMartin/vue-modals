<template>
    <Dialog v-model:visible="visible" modal @after-hide="remove()">
        <slot :close />
    </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { useModal } from '@noeldemartin/vue-modals';

const { visible, close, remove } = useModal({ removeOnClose: false });
</script>
