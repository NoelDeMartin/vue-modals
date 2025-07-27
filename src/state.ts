import { _modals } from '@noeldemartin/vue-modals/_internals/state';
import { computed } from 'vue';
import type { Component } from 'vue';

export interface ModalController<T extends object = never> {
    id: string;
    component: Component;
    props: Record<string, unknown>;
    close(payload?: T): Promise<void>;
}

export const modals = computed(() => _modals.value as ModalController[]);
