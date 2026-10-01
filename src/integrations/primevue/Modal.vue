<template>
    <Dialog v-model:visible="visible" modal @after-hide="remove()">
        <slot :close />
    </Dialog>
</template>

<script setup lang="ts">
import { useModal } from '@noeldemartin/vue-modals';
import Dialog from 'primevue/dialog';

const { visible, close, remove } = useModal({ removeOnClose: false });
</script>
