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
export const matchingCountState = atom({
  key: 'matchingCountState', // Mỗi atom phải có một key duy nhất
  default: 0, // Giá trị mặc định ban đầu
});
export const matchingCountState2 = atom({
  key: 'matchingCountState2', // Mỗi atom phải có một key duy nhất
  default: 0, // Giá trị mặc định ban đầu
});

export const selectService = atom({
  key: 'SelectService', // Mỗi atom phải có một key duy nhất
  default: 0, // Giá trị mặc định ban đầu
});


export const status = atom({
  key: 'Status', // Mỗi atom phải có một key duy nhất
  default: "Tất cả", // Giá trị mặc định ban đầu
});