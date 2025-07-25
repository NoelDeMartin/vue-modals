<template>
    <Transition @before-leave="modal.onHide" @after-leave="modal.onAfterHide">
        <div v-if="modal.visible.value">
            <slot :close="modal.close" />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { injectOrFail } from '@noeldemartin/vue-modals/lib/_internals/vue';
import type { ModalInternals } from '@noeldemartin/vue-modals/lib/_internals/modals';

const modal = injectOrFail<ModalInternals>('modal');

onMounted(() => (modal.visible.value = true));
</script>
