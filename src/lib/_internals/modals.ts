import type { ModalController } from '@noeldemartin/vue-modals/lib/modals';
import type { Ref } from 'vue';

export interface ModalInternals<T extends object = never> extends ModalController<T> {
    visible: Ref<boolean>;
    onHide(): void;
    onAfterHide(): void;
}
