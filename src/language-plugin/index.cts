import type { VueLanguagePlugin } from '@vue/language-core';

import injectTypes from './inject-types';

const plugin: VueLanguagePlugin = () => {
    return {
        version: 2.1,
        name: '@noeldemartin/vue-modals',
        getEmbeddedCodes() {
            return [];
        },
        resolveEmbeddedCode(_, __, embeddedFile) {
            if (embeddedFile.id !== 'script_ts') {
                return;
            }

            injectTypes(embeddedFile.content);
        },
    };
};

module.exports = plugin;
