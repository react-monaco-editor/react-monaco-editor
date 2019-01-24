export function processSize(size) {
  return !/^\d+$/.test(size.toString()) ? size : `${size}px`;
}
