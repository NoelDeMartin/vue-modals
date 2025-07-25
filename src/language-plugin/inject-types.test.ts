import { describe, expect, it } from 'vitest';
import type { Code } from '@vue/language-core';

import injectTypes from './inject-types';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

describe('language plugin', () => {

    testFixture('Simple.vue');
    testFixture('Complex.vue');
    testFixture('Complete.vue');
    testFixture('CompleteWithExpose.vue');

});

function testFixture(name: string) {
    it(`Inject types: ${name}`, () => {
        const input = loadCodeFixture(`${name}-input`);
        const output = loadCodeFixture(`${name}-output`);

        injectTypes(input);

        expect(input).toEqual(output);
    });
}

function loadCodeFixture(name: string): Code[] {
    return JSON.parse(
        readFileSync(fileURLToPath(new URL(`./testing/fixtures/${name}.json`, import.meta.url)), 'utf-8'),
    ) as Code[];
}
