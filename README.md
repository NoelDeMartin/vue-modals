# Vue Modals ![CI](https://github.com/NoelDeMartin/vue-modals/actions/workflows/ci.yml/badge.svg)

The missing library to do Vue Modals right:

- 🪐 Open modals from anywhere (even outside of Vue components!).
- 📤 Return promises from modals for seamless async workflows.
- 🧼 Clean and simple API.
- 🧙 Full TypeScript support.
- 📦 Tiny library with zero dependencies.

To learn more, read this blog post: [The Problems With Modals, and How to Solve Them](https://noeldemartin.com/blog/the-problems-with-modals-and-how-to-solve-them).

## Installation

First, install it using your favorite package manager:

```sh
pnpm add @noeldemartin/vue-modals
```

Then, place a `<ModalsPortal>` somewhere within your app (wherever you want to render modals).

Finally, open modals like this:

```js
import { showModal } from '@noeldemartin/vue-modals';
import MyModal from './MyModal.vue';

const { answer } = await showModal(MyModal, { question: 'How many golf balls fit into a Boeing 747?' });
```

## Usage

The second argument in the `showModal` function will be passed as component properties, and modals can be closed by emitting a `close` event (the payload of which will be returned in a promise). You can take advantage of Vue's TypeScript features to type both:

```vue
<template>
    <Modal>
        <button @click="$emit('close', { answer: 'The Answer' })">Close</button>
    </Modal>
</template>

<script setup lang="ts">
defineEmits<{ close: [{ answer: string }] }>();
defineProps<{ question: string }>();
</script>
```

```ts
const { answer } = await showModal(MyModal, { question: 'How many golf balls fit into a Boeing 747?' });
// 👆 answer will be typed as `string | undefined` (in case the modal is dismissed)
// 👆 showModal's second argument will be typed as `{ question: string }`
```

### Modal responses

Given that modals can also be dismissed, the payload from the `close` event won't be directly returned in the promise. Instead, it will be merged into an object with a `dismissed` boolean:

```ts
defineEmits<{ close: [{ answer: string }] }>();
// 👆 showModal will return `Promise<{ dismissed: false; answer: string } | { dismissed: true; answer?: undefined }>`

defineEmits<{ close: [string] }>();
// 👆 showModal will return `Promise<{ dismissed: false; response: string } | { dismissed: true; response?: undefined }>`

defineEmits<{ somethingElse: [] }>();
// 👆 showModal will return `Promise<{ dismissed: boolean }>`
```

### Customizing modals

If you want to have an overlay that sits behind your modals, you can use the `overlay` slot in the `<ModalsPortal>`. You can also style the modals container passing class or style attributes, and use `<Transition>` to implement animations:

```html
<ModalsPortal class="fixed inset-0 flex items-center justify-center pointer-events-none">
    <template #overlay="{ show }">
        <Transition
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="show" class="fixed inset-0 bg-gray-500/75" />
        </Transition>
    </template>
</ModalsPortal>
```

By default, modals will be rendered one after another in the DOM. However, some libraries may require to nest them (such as [Reka UI](https://reka-ui.com/docs/components/dialog#nested-dialog)). In that case, you can use the `nested` attribute to indicate that the rendering of child modals will happen in each modal component, rather than the root:

```vue
<!-- This will only render the first active modal -->
<ModalsPortal nested />
```

Modals don't need to use any special components, so they can be simple divs:

```html
<div class="bg-white p-4 rounded-lg shadow-lg z-10 pointer-events-auto">
    <p>My modal content</p>
</div>
```

However, if you also want to configure some animations, you can use the `<Modal>` component and pass the same attributes used in the `<Transition>` component:

```html
<Modal
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
    class="bg-white p-4 rounded-lg shadow-lg z-10 pointer-events-auto"
>
    <p>My modal content</p>
</Modal>
```

Finally, if you want to create your own modal wrapper, you can use `useModal()`. This will expose a couple of utilities you can use to work with the modal. By default, modals are removed from the down when closed, but you can pass the `{ removeOnClose: false }` option to disable it. If you do, make sure to call `remove()` to remove it yourself. Combined with `visible`, and using the native `<Transition>`, you can achieve the same result as the `<Modal>` component to customize it on your own:

```vue
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
```

You can also use `child` if you want to render nested modals using the `<ModalComponent>`:

```vue
<template>
    <Transition @after-leave="remove()">
        <div v-if="visible">
            <slot :close />
        </div>
    </Transition>

    <ModalComponent v-if="child" :is="child" />
</template>

<script setup lang="ts">
import { useModal } from '@noeldemartin/vue-modals/composition';

const { child, visible, close, remove } = useModal({ removeOnClose: false });
</script>
```

However, keep in mind that if you're going to work with modals this way, you'll need to implement all the accessibility functionality on your own (focus trapping, keyboard events, etc.).

Instead, you'll probably want to integrate with an existing component library.

### Third-party integrations

In order to use this with component libraries, you'll need to follow similar techniques from the ones described in the previous section.

There are some built-in integrations, but feel free to look at the [src/integrations/](./src/integrations/) folder to learn more.

#### PrimeVue

You can use the `<ModalsPortal>` component as usual, but import `<Modal>` from `@noeldemartin/vue-modals/primevue` instead. Attributes will be passed down to PrimeVue's native [`<Dialog>`](https://primevue.org/dialog/#api.dialog.props) component, such as `header`, `footer`, `maximizable`, etc.

```vue
<template>
    <Modal header="My Awesome Modal">
        <p>My modal content</p>
    </Modal>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { Modal } from '@noeldemartin/vue-modals/primevue';
</script>
```

#### Shadcn

Following Shadcn's philosophy, this library doesn't export any code to integrate with the library. Instead, you'll want to copy & paste these into your project:

`src/components/ui/modal/Modal.vue`

```vue
<template>
    <Dialog :open="modal.visible.value" @update:open="$event || close()">
        <DialogContent>
            <slot />

            <ModalComponent v-if="child" :is="child" />
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useModal, ModalComponent } from '@noeldemartin/vue-modals';

const { child, ...modal } = useModal({ removeOnClose: false });

function close() {
    modal.close();

    setTimeout(() => modal.remove(), 1000);
}
</script>
```

`src/components/ui/modal/ModalsPortal.vue`

```vue
<template>
    <ModalsPortal nested />
</template>

<script setup lang="ts">
import { ModalsPortal } from '@noeldemartin/vue-modals';
</script>
```

`src/components/ui/index.ts`

```ts
export { default as Modal } from './Modal.vue';
export { default as ModalsPortal } from './ModalsPortal.vue';
```

Once that is set up, you should be able to create modals like this:

```vue
<template>
    <Modal>
        <DialogHeader>
            <DialogTitle>My Awesome Modal</DialogTitle>
        </DialogHeader>
        <p>Modal content goes here</p>
    </Modal>
</template>

<script setup lang="ts">
import { Modal } from '@/components/ui/modal';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
</script>
```
