<template>
    <Transition @before-leave="modal.onHide" @after-leave="modal.onAfterHide">
        <div v-if="modal.visible.value">
            <slot :close="modal.close" />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useModalInternals } from '@noeldemartin/vue-modals/_internals/composition';

const modal = useModalInternals();

modal.controlled = true;

onMounted(() => (modal.visible.value = true));
</script>
