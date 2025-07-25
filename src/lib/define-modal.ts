import { injectOrFail } from '@noeldemartin/vue-modals/lib/_internals/vue';
import type { ModalController } from '@noeldemartin/vue-modals/lib/modals';

export function defineModal<T extends object = never>(): ModalController<T> {
    return injectOrFail<ModalController<T>>('modal');
}
