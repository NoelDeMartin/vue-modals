import { fail } from '@noeldemartin/utils';
import { inject, onMounted, provide } from 'vue';
import type { ModalController } from '@noeldemartin/vue-modals/state';

const controllerSymbol = Symbol();

export function provideModalController<T extends object = never>(controller: ModalController<T>): void {
    provide(controllerSymbol, controller);
}

export function useModal<T extends object = never>(options?: { controlled?: boolean }): ModalController<T> {
    const modal =
        inject<ModalController<T>>(controllerSymbol) ??
        fail<ModalController<T>>(
            'Could not resolve modal controller, useModal() should only be called within a modal component.',
        );

    modal.controlled.value = options?.controlled ?? false;

    onMounted(() => (modal.visible.value = true));

    return modal;
}
