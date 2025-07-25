import { fail } from '@noeldemartin/utils';
import { type InjectionKey, inject } from 'vue';

export function injectOrFail<T>(key: InjectionKey<T> | string, errorMessage?: string): T {
    return inject(key) ?? fail(errorMessage ?? `Could not resolve '${String(key)}' injection key`);
}
