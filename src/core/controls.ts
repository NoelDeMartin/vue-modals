import { ref, shallowRef } from 'vue';
import { type ModalController, modals } from '@noeldemartin/vue-modals/state';
import { type Constructor, type IsAny, type Pretty, PromisedValue, isObject, uuid } from '@noeldemartin/utils';
import type { Component } from 'vue';

export type GetModalProps<T extends Component> = T extends Constructor<{ $props: infer TProps }> ? TProps : object;
export type GetModalResponse<T extends Component> =
    T extends Constructor<{ $emit: (event: 'close', args: infer TResponse) => void }>
        ? IsAny<TResponse> extends true
            ? { dismissed: boolean }
            : TResponse extends object
              ?
                    | Pretty<{ dismissed: false } & TResponse>
                    | Pretty<{ dismissed: true } & { [k in keyof TResponse]?: undefined }>
              : { dismissed: false; response: TResponse } | { dismissed: true; response?: undefined }
        : { dismissed: boolean };

export function showModal<T extends Component>(
    component: T & object extends GetModalProps<T> ? T : never,
    props?: GetModalProps<T>
): Promise<GetModalResponse<T>>;

export function showModal<T extends Component>(
    component: T & object extends GetModalProps<T> ? never : T,
    props: GetModalProps<T>
): Promise<GetModalResponse<T>>;

export function showModal<T extends Component>(
    component: T,
    componentProps?: GetModalProps<T>,
): Promise<GetModalResponse<T>> {
    const id = uuid();
    const props = componentProps ?? {};
    const controlled = ref(false);
    const visible = ref(false);
    const child = shallowRef<ModalController | null>(null);
    const promisedHidden = new PromisedValue<void>();
    const promisedResult = new PromisedValue<GetModalResponse<T>>();

    const close = async (result?: unknown) => {
        visible.value = false;

        if (isObject(result)) {
            promisedResult.resolve({ dismissed: false, ...result } as GetModalResponse<T>);
        } else if (result !== undefined) {
            promisedResult.resolve({ dismissed: false, response: result } as unknown as GetModalResponse<T>);
        } else {
            promisedResult.resolve({ dismissed: true } as GetModalResponse<T>);
        }

        if (!controlled.value) {
            onHide();
            onAfterHide();
        }

        await promisedHidden;
    };

    const onHide = async () => {
        promisedHidden.resolve();
    };

    const onAfterHide = async () => {
        if (!promisedResult.isResolved()) {
            await close();
        }

        const index = modals.value.findIndex((modal) => modal.id === id);

        if (index !== -1) {
            return;
        }

        const parentModal = modals.value[index - 1];

        if (parentModal) {
            parentModal.child.value = modals.value[index]?.child.value ?? null;
        }

        modals.value = modals.value.filter((modal) => modal.id !== id);
    };

    const modal = {
        id,
        component,
        props,
        controlled,
        visible,
        child,
        close,
        onHide,
        onAfterHide,
    } satisfies ModalController;

    const topModal = modals.value[modals.value.length - 1];

    if (topModal) {
        topModal.child.value = modal;
    }

    modals.value = modals.value.concat([modal]);

    return promisedResult;
}
