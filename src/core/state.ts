import { shallowRef } from 'vue';
import type { Component, Ref } from 'vue';

export interface ModalMetadata {}

export interface ModalController<T = never> {
    id: string;
    component: Component;
    props: Record<string, unknown>;
    metadata: ModalMetadata;
    visible: Ref<boolean>;
    removeOnClose: Ref<boolean>;
    removeOnCloseAfterDelay: Ref<number | null>;
    child: Ref<ModalController | null>;
    promisedResult: Promise<T>;
    close(payload?: T): Promise<void>;
    remove(): void;
}

export const modals = shallowRef<ModalController[]>([]);
