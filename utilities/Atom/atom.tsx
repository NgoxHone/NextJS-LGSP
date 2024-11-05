import { atom } from "recoil";

export const accessTokenState = atom<string | null>({
  key: "accessTokenState", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const idTokenState = atom<string | null>({
  key: "idTokenState",
  default: "",
});

export const expiresAtState = atom<number | null>({
  key: "expiresAtState",
  default: null,
});
export const optionService = atom<object | null>({
  key: "optionService",
  default: null,
});
export const optionEnviroment = atom<string | null>({
  key: "optionEnviroment",
  default: "PRODUCTION",
});
export const optionOptionApp = atom<string | null>({
  key: "optionOptionApp",
  default: null,
});
export const optionOption = atom<string | null>({
  key: "optionOptionApp",
  default: null,
});