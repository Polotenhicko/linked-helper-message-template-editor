export function getDataset(el: HTMLElement, dataId: string): string | null {
  const currentData = el.dataset[dataId];
  return currentData === undefined ? null : currentData;
}
