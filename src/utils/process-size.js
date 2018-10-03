export default function processSize(size) {
  return !/^\d+$/.test(size) ? size : `${size}px`;
}
