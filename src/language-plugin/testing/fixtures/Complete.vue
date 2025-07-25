<template>
    <Modal style="background: white; padding: 20px; border-radius: 10px">
        <h1>My Modal</h1>
        It works!
        <button type="button" @click="close({ foo: 'bar' })">Close</button>
    </Modal>
</template>

<script setup lang="ts">
import { Modal, defineModal } from '@noeldemartin/vue-modals';

const { close } = defineModal<{ foo: string }>();
</script>
