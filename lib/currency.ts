export const sekFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});

export function formatSEK(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return sekFormatter.format(safeValue);
}
