import type { Nullable } from '@noeldemartin/utils';
import type { Code } from '@vue/language-core';

function extractModalType(code: Code): string | null {
    if (typeof code !== 'string' && Array.isArray(code) && code.length >= 1) {
        return extractModalType(code[0]);
    }

    if (typeof code !== 'string') {
        return null;
    }

    const match = /defineModal<([^>]+)>\(\)/gs.exec(code);

    return match?.[1]?.replace(/[\n\r\s]+/g, ' ').trim() ?? null;
}

function mapFirst<TItem, TResult>(content: TItem[], map: (item: TItem) => Nullable<TResult>): TResult | null {
    for (const item of content) {
        const result = map(item);

        if (result !== null && result !== undefined) {
            return result;
        }
    }

    return null;
}

function findModalType(content: Code[]): string | null {
    return mapFirst(content, extractModalType);
}

function findIndex(content: Code[], predicate: (code: Code) => boolean): number {
    return content.findIndex(predicate);
}

function findStringIndex(content: Code[], predicate: (str: string) => boolean): number {
    return findIndex(content, (code) => typeof code === 'string' && predicate(code));
}

function findArrayStringIndex(content: Code[], predicate: (str: string) => boolean): number {
    return findIndex(
        content,
        (code) => Array.isArray(code) && code.length > 0 && typeof code[0] === 'string' && predicate(code[0]),
    );
}

function findVueModalsImportIndex(content: Code[]): number {
    const stringIndex = findStringIndex(content, (code) => code.includes('@noeldemartin/vue-modals'));

    if (stringIndex >= 0) {
        return stringIndex;
    }

    return findArrayStringIndex(content, (code) => code.includes('@noeldemartin/vue-modals'));
}

function updateVueModalsImport(content: Code[], index: number): void {
    const code = content[index];

    if (typeof code === 'string' && code.includes('defineModal') && !code.includes('__modalResult')) {
        content[index] = code.replace('defineModal', 'defineModal, __modalResult');

        return;
    }

    if (
        typeof code === 'string' &&
        code.includes('} from \'@noeldemartin/vue-modals\'') &&
        !code.includes('__modalResult')
    ) {
        content[index] = code.replace(
            '} from \'@noeldemartin/vue-modals\'',
            ', __modalResult } from \'@noeldemartin/vue-modals\'',
        );

        return;
    }

    if (
        !Array.isArray(code) ||
        code.length <= 0 ||
        typeof code[0] !== 'string' ||
        !code[0].includes('defineModal') ||
        code[0].includes('__modalResult')
    ) {
        return;
    }

    code[0] = code[0].replace('defineModal', 'defineModal, __modalResult');
}

function addImport(content: Code[]): void {
    const importIndex = findStringIndex(content, (code) => code.startsWith('import '));

    if (importIndex < 0) {
        content.splice(0, 0, 'import { __modalResult } from \'@noeldemartin/vue-modals\';\n\n');

        return;
    }

    // Find last import statement
    let lastImportIndex = importIndex;

    for (let i = importIndex + 1; i < content.length; i++) {
        const code = content[i];

        if (typeof code === 'string' && code.startsWith('import ')) {
            lastImportIndex = i;

            continue;
        }

        if (typeof code === 'string' && code.trim() !== '' && !code.startsWith('//')) {
            break;
        }
    }

    content.splice(lastImportIndex + 1, 0, 'import { __modalResult } from \'@noeldemartin/vue-modals\';\n');
}

function findSetupReturnIndex(content: Code[], startIndex: number): number | null {
    for (let i = startIndex; i < content.length; i++) {
        const code = content[i];

        if (typeof code !== 'string') {
            continue;
        }

        if (code.trim() === 'return {' || code.trim() === '},') {
            return i;
        }
    }

    return null;
}

function findDefaultExportSetupIndex(content: Code[]): number | null {
    const exportIndex = findStringIndex(content, (code) => code.startsWith('export default '));

    if (exportIndex === -1) {
        return null;
    }

    for (let i = exportIndex; i < content.length; i++) {
        const code = content[i];

        if (typeof code === 'string' && code.trim() === 'setup() {') {
            return i;
        }
    }

    return null;
}

function updateVLSExposed(content: Code[], modalType: string): boolean {
    const vlsIndex = findStringIndex(content, (code) => code === 'const __VLS_exposed = ');

    if (vlsIndex === -1) {
        return false;
    }

    const valueIndex = findArrayStringIndex(content, (code) => code.startsWith('{') && code.endsWith('}'));
    if (valueIndex === -1) {
        return false;
    }

    const code = content[valueIndex];
    if (Array.isArray(code) && code.length > 0 && typeof code[0] === 'string') {
        const trimmed = code[0].replace(/\s+}$/g, '}');
        code[0] = trimmed.replace(/}$/, `, ...({} as { [__modalResult]: ${modalType} }) }`);
        return true;
    }

    return false;
}

function updateExportDefaultReturnType(content: Code[], modalType: string): boolean {
    const returnIndex = findStringIndex(content, (code) => code.trim() === 'return {} as ');
    if (returnIndex === -1) {
        return false;
    }

    for (let i = returnIndex + 1; i < content.length; i++) {
        const code = content[i];

        if (typeof code !== 'string' || !code.includes('typeof __VLS_exposed')) {
            continue;
        }

        content[i] = `typeof __VLS_exposed & { [__modalResult]: ${modalType} }`;

        return true;
    }

    return false;
}

export default function(content: Code[]): void {
    const modalType = findModalType(content);

    if (!modalType) {
        return;
    }

    // Handle import
    const vueModalsImportIndex = findVueModalsImportIndex(content);

    vueModalsImportIndex >= 0 ? updateVueModalsImport(content, vueModalsImportIndex) : addImport(content);

    // Try to update VLS exposed object first
    if (updateVLSExposed(content, modalType)) {
        return;
    }

    // Try to update export default return type
    if (updateExportDefaultReturnType(content, modalType)) {
        return;
    }

    // Fallback: update setup function
    const setupIndex = findDefaultExportSetupIndex(content);
    if (!setupIndex) {
        return;
    }

    const returnIndex = findSetupReturnIndex(content, setupIndex);
    if (!returnIndex) {
        return;
    }

    const code = content[returnIndex];
    if (typeof code !== 'string') {
        return;
    }

    switch (code.trim()) {
        case 'return {':
            content.splice(returnIndex + 1, 0, `...({} as { [__modalResult]: ${modalType} }),\n`);
            break;
        case '},':
            content.splice(returnIndex, 0, `return {} as { [__modalResult]: ${modalType} };\n`);
            break;
    }
}
