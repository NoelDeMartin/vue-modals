import { shallowRef } from 'vue';
import type { Component, Ref } from 'vue';

export interface ModalController<T extends object = never> {
    id: string;
    component: Component;
    props: Record<string, unknown>;
    controlled: Ref<boolean>;
    visible: Ref<boolean>;
    close(payload?: T): Promise<void>;
    onHide(): void;
    onAfterHide(): void;
}

export const modals = shallowRef<ModalController[]>([]);
