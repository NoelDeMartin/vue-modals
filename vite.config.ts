import { URL, fileURLToPath } from 'node:url';

import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: {
                index: fileURLToPath(new URL('./src/core/index.ts', import.meta.url)),
                primevue: fileURLToPath(new URL('./src/integrations/primevue/index.ts', import.meta.url)),
            },
            formats: ['es'],
            fileName: (_, entry) => {
                if (entry.includes('primevue')) {
                    return 'primevue.js';
                }

                return 'index.js';
            },
        },
        rollupOptions: {
            external: ['@noeldemartin/utils', 'vue', 'primevue/dialog'],
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
            '@noeldemartin/vue-modals': fileURLToPath(new URL('./src/core/', import.meta.url)),
        },
    },
});
