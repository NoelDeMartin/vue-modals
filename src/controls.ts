import { ref } from 'vue';
import { _modals } from '@noeldemartin/vue-modals/_internals/state';
import { type Constructor, type Pretty, PromisedValue, isObject, uuid } from '@noeldemartin/utils';
import type { Component } from 'vue';
import type { IsAny } from '@noeldemartin/vue-modals/_internals/types';

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

export function showModal<T extends Component>(component: T, props?: GetModalProps<T>): Promise<GetModalResponse<T>> {
    const id = uuid();
    const visible = ref(false);
    const promisedHidden = new PromisedValue<void>();
    const promisedResult = new PromisedValue<GetModalResponse<T>>();

    _modals.value = _modals.value.concat([
        {
            id,
            component,
            props: props ?? {},

            async close(result?: unknown) {
                visible.value = false;

                if (isObject(result)) {
                    promisedResult.resolve({ dismissed: false, ...result } as GetModalResponse<T>);
                } else if (result !== undefined) {
                    promisedResult.resolve({ dismissed: false, response: result } as unknown as GetModalResponse<T>);
                } else {
                    promisedResult.resolve({ dismissed: true } as GetModalResponse<T>);
                }

                if (!this.controlled) {
                    this.onHide();
                    this.onAfterHide();
                }

                await promisedHidden;
            },

            // Internals
            visible,
            controlled: false,

            async onHide() {
                promisedHidden.resolve();
            },

            async onAfterHide() {
                if (!promisedResult.isResolved()) {
                    await this.close();
                }

                _modals.value = _modals.value.filter((modal) => modal.id !== id);
            },
        },
    ]);

    return promisedResult;
}
