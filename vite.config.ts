import { URL, fileURLToPath } from 'node:url';

import { fmt, lint, pack } from '@noeldemartin/vite-plus-config';
import vue from '@vitejs/plugin-vue';
import Vue from 'unplugin-vue/rolldown';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
    pack: {
        ...pack,
        entry: {
            index: 'src/core/index.ts',
            primevue: 'src/integrations/primevue/index.ts',
        },
        plugins: [Vue({ isProduction: true })],
        dts: { vue: true },
    },
    plugins: lazyPlugins(() => [vue()]),
    resolve: {
        alias: {
            '@noeldemartin/vue-modals': fileURLToPath(new URL('./src/core/', import.meta.url)),
        },
    },
    fmt,
    lint: { extends: [lint] },
});
