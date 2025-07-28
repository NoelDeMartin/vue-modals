<template>
    <Dialog v-model:visible="modal.visible.value" modal @hide="modal.onHide" @after-hide="modal.onAfterHide">
        <slot :close="modal.close" />
    </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { useModal } from '@noeldemartin/vue-modals';

const modal = useModal({ controlled: true });
</script>
