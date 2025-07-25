import { computed, ref, shallowRef } from 'vue';
import { type Constructor, PromisedValue, isObject, uuid } from '@noeldemartin/utils';
import type { Component } from 'vue';
import type { ModalInternals } from '@noeldemartin/vue-modals/lib/_internals/modals';

const _modals = shallowRef<ModalInternals[]>([]);

export declare const __modalResult: unique symbol;

export type ModalComponent<T> = Component & { [__modalResult]: T };
export type GetComponentProps<T extends Component> = T extends Constructor<{ $props: infer TProps }> ? TProps : object;
export type GetModalResult<T extends Component> =
    T extends Constructor<{ [__modalResult]: infer TResult }>
        ? ({ cancelled: true } & Partial<Record<keyof TResult, undefined>>) | ({ cancelled: false } & TResult)
        : { cancelled: boolean };

export interface ModalController<T extends object = never> {
    id: string;
    component: Component;
    props: Record<string, unknown>;
    close(payload?: T): Promise<void>;
}

export const modals = computed(() => _modals.value as ModalController[]);

export function showModal<T extends Component>(component: T, props?: GetComponentProps<T>): Promise<GetModalResult<T>> {
    const id = uuid();
    const visible = ref(false);
    const promisedHidden = new PromisedValue<void>();
    const promisedResult = new PromisedValue<GetModalResult<T>>();

    _modals.value = _modals.value.concat([
        {
            id,
            component,
            props: props ?? {},

            async close(result?: unknown) {
                visible.value = false;

                promisedResult.resolve(
                    (isObject(result) ? { cancelled: false, ...result } : { cancelled: true }) as GetModalResult<T>,
                );

                await promisedHidden;
            },

            // Internals
            visible,

            async onHide() {
                promisedHidden.resolve();
            },

            async onAfterHide() {
                if (!promisedResult.isResolved()) {
                    await close();
                }

                _modals.value = _modals.value.filter((modal) => modal.id !== id);
            },
        },
    ]);

    return promisedResult;
}
