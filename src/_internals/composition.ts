import { useModal } from '@noeldemartin/vue-modals/composition';
import type { ModalControllerInternals } from '@noeldemartin/vue-modals/_internals/state';

export function useModalInternals<T extends object = never>(): ModalControllerInternals<T> {
    return useModal() as ModalControllerInternals<T>;
}
