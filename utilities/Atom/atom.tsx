import { atom } from 'recoil';

export const accessTokenState = atom<string | null>({
  key: 'accessTokenState', // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const idTokenState = atom<string | null>({
  key: 'idTokenState',
  default: null,
});

export const expiresAtState = atom<number | null>({
  key: 'expiresAtState',
  default: null,
});