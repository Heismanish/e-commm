import { atom } from "recoil";

const textState = atom<string>({
  key: "text",
  default: "hello",
});

export default textState;
