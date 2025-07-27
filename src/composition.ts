import { fail } from '@noeldemartin/utils';
import { inject } from 'vue';
import type { ModalController } from '@noeldemartin/vue-modals/state';

export function useModal<T extends object = never>(): ModalController<T> {
    return (
        inject<ModalController<T>>('modal') ??
        fail('Could not resolve modal context, useModal() should only be called within a modal component.')
    );
}
