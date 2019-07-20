export function processSize(size) {
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

let counter = 0;

export function createId() {
  counter += 1;
  return `id_${counter}`;
}

export function noop() { }
