# Vue Modals ![CI](https://github.com/NoelDeMartin/vue-modals/actions/workflows/ci.yml/badge.svg)

The missing library to do Vue Modals right:

- 🪐 Open modals from anywhere (even outside of Vue components!).
- 📤 Return promises from modals for seamless async workflows.
- 🧼 Clean and simple API.
- 🧙 Full TypeScript support.
- 📦 Tiny library with zero dependencies.

## Installation

First, install it using your favorite package manager:

```sh
pnpm add @noeldemartin/vue-modals
```

Then, make sure to place a `<ModalsPortal>` somewhere within your app (wherever you want modals to render).

Finally, you should be able to open modals like this:

```ts
import { showModal } from '@noeldemartin/vue-modals';
import MyModal from './MyModal.vue';

const { answer } = await showModal(MyModal, { question: 'How many golf balls fit into a Boeing 747?' });
```

## Usage

The second argument in the `showModal` function will be passed as component properties, and modals can be closed by emitting a `close` event (the payload of which will be returned in a promise). You can take advantage of Vue's TypeScript features to type both:

```vue
<template>
    <Modal>
        <button @click="$emit('close', 'The Answer')">Close</button>
    </Modal>
</template>

<script setup lang="ts">
defineEmits<{ close: [{ answer: string }] }>();
defineProps<{ question: string }>();
</script>
```

### Modal responses

Given that modals can also be dismissed, the payload from the `close` event won't be directly returned in the promise. Instead, it will be merged into an object with a `dismissed` boolean:

```ts
defineEmits<{ close: [{ answer: string }] }>();
// 👆 showModal return will be a Promise<{ dismissed: false; answer: string } | { dismissed: true; answer?: undefined }>

defineEmits<{ close: [string] }>();
// 👆 showModal return will be a Promise<{ dismissed: false; response: string } | { dismissed: true; response?: undefined }>

defineEmits<{ somethingElse: [] }>();
// 👆 showModal return will be a Promise<{ dismissed: boolean }>
```
