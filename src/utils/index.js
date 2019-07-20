export function processSize(size) {
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

export function noop() {}
