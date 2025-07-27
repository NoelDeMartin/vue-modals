import type { ModalController } from '@noeldemartin/vue-modals/state';
import { type Ref, shallowRef } from 'vue';

export const _modals = shallowRef<ModalControllerInternals[]>([]);

export interface ModalControllerInternals<T extends object = never> extends ModalController<T> {
    controlled: boolean;
    visible: Ref<boolean>;
    onHide(): void;
    onAfterHide(): void;
}
