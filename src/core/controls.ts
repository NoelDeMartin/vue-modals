import {
    type Constructor,
    type IsAny,
    type IsPlainObject,
    type Pretty,
    PromisedValue,
    after,
    isPlainObject,
    uuid,
} from '@noeldemartin/utils';
import { type ModalController, type ModalMetadata, modals } from '@noeldemartin/vue-modals/state';
import { ref, shallowRef, watch } from 'vue';
import type { Component } from 'vue';

export type GetModalProps<T extends Component> = T extends Constructor<{ $props: infer TProps }> ? TProps : object;
export type GetModalResponse<T extends Component> =
    T extends Constructor<{ $emit?: (event: 'close', args: infer TResponse) => void }>
        ? IsAny<TResponse> extends true
            ? { dismissed: boolean }
            : IsPlainObject<TResponse> extends true
              ?
                    | Pretty<{ dismissed: false } & TResponse>
                    | Pretty<{ dismissed: true } & { [k in keyof TResponse]?: undefined }>
              : { dismissed: false; response: TResponse } | { dismissed: true; response?: undefined }
        : { dismissed: boolean };

export interface ModalOptions {
    metadata?: ModalMetadata;
}

export function createModal<T extends Component>(
    component: T & object extends GetModalProps<T> ? T : never,
    props?: GetModalProps<T>,
    options?: ModalOptions,
): ModalController<GetModalResponse<T>>;

export function createModal<T extends Component>(
    component: T & object extends GetModalProps<T> ? never : T,
    props: GetModalProps<T>,
    options?: ModalOptions,
): ModalController<GetModalResponse<T>>;

export function createModal<T extends Component>(
    component: T,
    componentProps?: GetModalProps<T>,
    options: ModalOptions = {},
): ModalController<GetModalResponse<T>> {
    const id = uuid();
    const props = componentProps ?? {};
    const metadata = options.metadata ?? ({} as ModalMetadata);
    const visible = ref(false);
    const removeOnClose = ref(true);
    const removeOnCloseAfterDelay = ref<number | null>(null);
    const child = shallowRef<ModalController | null>(null);
    const promisedResult = new PromisedValue<GetModalResponse<T>>();
    const watchingVisible = watch(visible, (newVisible) => newVisible || close());

    const close = async (result?: unknown) => {
        watchingVisible.stop();
        visible.value = false;

        if (isPlainObject(result)) {
            promisedResult.resolve({ dismissed: false, ...result } as GetModalResponse<T>);
        } else if (result !== undefined) {
            promisedResult.resolve({ dismissed: false, response: result } as unknown as GetModalResponse<T>);
        } else {
            promisedResult.resolve({ dismissed: true } as GetModalResponse<T>);
        }

        if (removeOnClose.value) {
            if (removeOnCloseAfterDelay.value) {
                await after(removeOnCloseAfterDelay.value);
            }

            remove();
        }
    };

    const remove = () => {
        const index = modals.value.findIndex((modal) => modal.id === id);

        if (index === -1) {
            return;
        }

        if (modals.value[index]?.visible.value) {
            // oxlint-disable-next-line typescript/no-floating-promises
            modals.value[index]?.close();
        }

        const parentModal = modals.value[index - 1];

        if (parentModal) {
            parentModal.child.value = modals.value[index]?.child.value ?? null;
        }

        modals.value = modals.value.filter((modal) => modal.id !== id);
    };

    return {
        id,
        component,
        props,
        metadata,
        removeOnClose,
        removeOnCloseAfterDelay,
        visible,
        child,
        close,
        remove,
        promisedResult,
    };
}

export function showModal<T extends Component>(
    component: T & object extends GetModalProps<T> ? T : never,
    props?: GetModalProps<T>,
    options?: ModalOptions,
): Promise<GetModalResponse<T>>;

export function showModal<T extends Component>(
    component: T & object extends GetModalProps<T> ? never : T,
    props: GetModalProps<T>,
    options?: ModalOptions,
): Promise<GetModalResponse<T>>;

export function showModal<T extends ModalController>(component: ModalController<T>): Promise<T>;

export function showModal<T extends Component>(
    componentOrModal: T | ModalController,
    componentProps?: GetModalProps<T>,
    options?: ModalOptions,
): Promise<GetModalResponse<T>> {
    const modal =
        'removeOnClose' in componentOrModal
            ? componentOrModal
            : // oxlint-disable-next-line typescript/no-explicit-any
              (createModal<any>(
                  componentOrModal,
                  (componentProps ?? {}) as GetModalProps<T>,
                  options,
              ) as ModalController);
    const topModal = modals.value[modals.value.length - 1];

    if (topModal) {
        topModal.child.value = modal;
    }

    modals.value = modals.value.concat([modal]);

    return modal.promisedResult;
}

export async function closeModal(id: string, options: { remove?: boolean; removeAfter?: number } = {}): Promise<void> {
    const modal = modals.value.find((m) => m.id === id);

    if (!modal) {
        return;
    }

    // oxlint-disable-next-line typescript/no-floating-promises
    modal.close();

    if (options.remove) {
        modal.remove();
    }

    if (options.removeAfter) {
        await after(options.removeAfter);

        modal.remove();
    }
}
