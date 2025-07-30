<template>
    <Transition @after-leave="remove()">
        <div v-if="visible">
            <slot :close />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useModal } from '@noeldemartin/vue-modals/composition';

const { visible, close, remove } = useModal({ removeOnClose: false });
</script>
