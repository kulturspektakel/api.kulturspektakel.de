export default function sanitizeTSQuery(
  query: string,
  options: {
    spacesOptional?: boolean;
    prefixMatching?: boolean;
  } = {},
): string {
  let q = query
    // sanitize tsquery: Only Letters, spaces, dash
    .replace(/[^\p{L}0-9- ]/gu, ' ')
    // remove spaces in front and beginning
    .trim()
    // sanitize tsquery: Only Letters, spaces, dash
    .replace(/\s\s*/g, '<->');

  if (options.prefixMatching) {
    q += ':*';
  }

  if (options.spacesOptional) {
    q = `${q}|${q.replace(/<->/g, '')}`;
  }

  return q;
}
