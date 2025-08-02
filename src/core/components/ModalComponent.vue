<template>
    <component :is="modal.component" v-bind="modalProps" @close="modal.close($event)" />
</template>

<script setup lang="ts" generic="T = never">
import { provideModal } from '@noeldemartin/vue-modals/composition';
import { computed, shallowRef, unref, watch } from 'vue';
import type { ModalController } from '@noeldemartin/vue-modals/state';

const { is: modal } = defineProps<{ is: ModalController<T> }>();
const modalRef = shallowRef(modal);
const modalProps = computed(() => {
    const props = {} as typeof modal.props;

    for (const property in modal.props) {
        props[property] = unref(modal.props[property]);
    }

    return props;
});

provideModal(modalRef);
watch(
    () => modal,
    () => void (modalRef.value = modal)
);
</script>
