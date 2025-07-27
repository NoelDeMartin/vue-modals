export type IsAny<T> = { __: 'never' } extends T ? true : false;
