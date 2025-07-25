<template>
    <Modal>
        <h1>My Modal</h1>
        It works!
        <button type="button" @click="close({ result: 'foo' })">Close with "foo"</button>
        <button type="button" @click="close({ result: 'bar' })">Close with "bar"</button>
    </Modal>
</template>

<script setup lang="ts">
import { Modal, defineModal } from '@noeldemartin/vue-modals';

const { close } = defineModal<{ result: string }>();

defineExpose({ somethingElse: true });
</script>
