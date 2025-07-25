import { URL, fileURLToPath } from 'node:url';

import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            formats: ['es'],
            fileName: 'noeldemartin-vue-modals',
        },
        rollupOptions: {
            external: ['@noeldemartin/utils', 'vue'],
        },
    },
    plugins: [
        vue(),
        dts({
            rollupTypes: true,
            tsconfigPath: './tsconfig.json',
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: {
            '@noeldemartin/vue-modals': fileURLToPath(new URL('./src/', import.meta.url)),
        },
    },
});
