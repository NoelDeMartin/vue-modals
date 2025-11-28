import { describe, it } from 'vitest';
import { type Expect, tt } from '@noeldemartin/testing';
import { type GetModalResponse, showModal } from './controls';
import type { Constructor, Equals } from '@noeldemartin/utils';
import type { Component } from 'vue';

describe('controls', () => {

    it(
        'infers response types',
        tt<
            | Expect<Equals<GetModalResponse<Constructor<Component>>, { dismissed: boolean }>>
            | Expect<
                  Equals<
                      GetModalResponse<Constructor<{ $emit: (event: 'close', payload: string) => void }>>,
                      { dismissed: false; response: string } | { dismissed: true; response?: undefined }
                  >
              >
            | Expect<
                  Equals<
                      GetModalResponse<Constructor<{ $emit: (event: 'close', payload: [string, number]) => void }>>,
                      { dismissed: false; response: [string, number] } | { dismissed: true; response?: undefined }
                  >
              >
            | Expect<
                  Equals<
                      GetModalResponse<Constructor<{ $emit: (event: 'close', payload: { answer: string }) => void }>>,
                      { dismissed: false; answer: string } | { dismissed: true; answer?: undefined }
                  >
              >
        >(),
    );

    it('infers prop types', () => {
        const TypedModal = {} as Constructor<{ $props: { question: string } }>;
        showModal(TypedModal, { question: 'How many golf balls fit into a Boeing 747?' });
        // @ts-expect-error - question is not a string
        showModal(TypedModal, { question: 42 });
        // @ts-expect-error - missing props
        showModal(TypedModal);

        const UntypedModal = {} as Component;
        showModal(UntypedModal, { foo: 'bar' });
        showModal(UntypedModal);
    });

});
