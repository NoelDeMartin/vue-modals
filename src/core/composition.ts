import { fail } from '@noeldemartin/utils';
import type { ModalController } from '@noeldemartin/vue-modals/state';
import { type Ref, computed, inject, onMounted, provide, watch } from 'vue';

const modalSymbol = Symbol();

export function injectModal<T = never>(): Ref<ModalController<T>> {
    return (
        inject(modalSymbol) ??
        fail(
            'Could not inject modal controller, ' +
                'are you calling injectModal() or useModal() outside of a modal component?',
        )
    );
}

export function provideModal<T = never>(controller: Ref<ModalController<T>>): void {
    provide(modalSymbol, controller);
}

// oxlint-disable-next-line typescript/explicit-module-boundary-types
export function useModal<T = never>(options?: { removeOnClose?: boolean; removeOnCloseAfterDelay?: number }) {
    let mounted = false;
    const modal = injectModal<T>();

    watch(
        modal,
        (newModal, oldModal) => {
            newModal.removeOnClose.value = options?.removeOnClose ?? true;
            newModal.removeOnCloseAfterDelay.value = options?.removeOnCloseAfterDelay ?? null;
            newModal.visible.value = mounted;

            if (!oldModal || !mounted) {
                return;
            }

            oldModal.visible.value = false;
        },
        { immediate: true },
    );

    onMounted(() => ((mounted = true), (modal.value.visible.value = true)));

    return {
        id: computed(() => modal.value.id),
        visible: computed(() => modal.value.visible.value),
        child: computed(() => modal.value.child.value),
        close: (payload?: T): Promise<void> => modal.value.close(payload),
        remove: (): void => modal.value.remove(),
    };
}
