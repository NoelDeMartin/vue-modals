import { describe, it } from 'vitest';
import { type Expect, tt } from '@noeldemartin/testing';
import { type GetModalResponse } from './controls';
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
                      GetModalResponse<Constructor<{ $emit: (event: 'close', payload: { answer: string }) => void }>>,
                      { dismissed: false; answer: string } | { dismissed: true; answer?: undefined }
                  >
              >
        >(),
    );

});
