import { MonacoEditorProps } from "./types";

export function processSize(size: number | string) {
  return !/^\d+$/.test(size as string) ? size : `${size}px`;
}

export function noop() {}

export const propCallbacks: Pick<MonacoEditorProps, "onChange"> = {
  onChange: null,
};
