<template>
    <component :is="modal.component" v-bind="modal.props" @close="modal.close($event)" />
</template>

<script setup lang="ts" generic="T extends object = never">
import { provideModal } from '@noeldemartin/vue-modals/composition';
import { shallowRef, watch } from 'vue';
import type { ModalController } from '@noeldemartin/vue-modals/state';

const { is: modal } = defineProps<{ is: ModalController<T> }>();
const modalRef = shallowRef(modal);

provideModal(modalRef);
watch(
    () => modal,
    () => void (modalRef.value = modal)
);
</script>
