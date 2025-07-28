<template>
    <Transition @before-leave="modal.onHide" @after-leave="modal.onAfterHide">
        <div v-if="modal.visible.value">
            <slot :close="modal.close" />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useModal } from '@noeldemartin/vue-modals/composition';

const modal = useModal({ controlled: true });
</script>
