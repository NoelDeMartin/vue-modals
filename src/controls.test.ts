import { describe, expectTypeOf, it } from 'vitest';
import { showModal } from '@noeldemartin/vue-modals/controls';
import NoResponse from '@noeldemartin/vue-modals/testing/fixtures/NoResponse.vue';
import LiteralResponse from '@noeldemartin/vue-modals/testing/fixtures/LiteralResponse.vue';
import ObjectResponse from '@noeldemartin/vue-modals/testing/fixtures/ObjectResponse.vue';

describe('controls', () => {

    it('infers response types', () => {
        expectTypeOf(showModal(NoResponse)).toEqualTypeOf<Promise<{ dismissed: boolean }>>();
        expectTypeOf(showModal(LiteralResponse)).toEqualTypeOf<
            Promise<{ dismissed: false; response: string } | { dismissed: true; response?: undefined }>
        >();
        expectTypeOf(showModal(ObjectResponse)).toEqualTypeOf<
            Promise<{ dismissed: false; answer: string } | { dismissed: true; answer?: undefined }>
        >();
    });

});
