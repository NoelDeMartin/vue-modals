import { URL, fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import Vue from 'unplugin-vue/rolldown';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
    pack: {
        entry: {
            index: 'src/core/index.ts',
            primevue: 'src/integrations/primevue/index.ts',
        },
        plugins: [Vue({ isProduction: true })],
        sourcemap: true,
        dts: { vue: true },
        fixedExtension: false,
        publint: true,
        attw: { profile: 'esm-only' },
    },
    plugins: lazyPlugins(() => [vue()]),
    resolve: {
        alias: {
            '@noeldemartin/vue-modals': fileURLToPath(new URL('./src/core/', import.meta.url)),
        },
    },
    fmt: {
        semi: true,
        singleQuote: true,
        tabWidth: 4,
        printWidth: 120,
        sortImports: true,
    },
    lint: {
        options: {
            typeAware: true,
            typeCheck: true,
        },
        rules: {
            'no-console': 'error',
            'no-unused-expressions': 'off',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_+$' }],
            'typescript/consistent-type-imports': 'error',
            'typescript/explicit-module-boundary-types': 'error',
            'typescript/no-explicit-any': ['warn', { ignoreRestArgs: true }],
            'typescript/no-unsafe-declaration-merging': 'off',
        },
        overrides: [
            {
                files: ['**/*.test.ts'],
                rules: {
                    'typescript/no-duplicate-type-constituents': 'off',
                    'typescript/unbound-method': 'off',
                },
            },
        ],
    },
});
