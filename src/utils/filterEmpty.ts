export default function filterEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  if (value === null || value === undefined) {
    return false;
  }
  return true;
}
