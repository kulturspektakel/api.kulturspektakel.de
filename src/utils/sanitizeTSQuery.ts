export default function sanitizeTSQuery(query: string): string {
  return (
    query
      // sanitize tsquery: Only Letters, spaces, dash
      .replace(/[^\p{L}0-9- ]/g, ' ')
      // remove spaces in front and beginning
      .trim()
      // sanitize tsquery: Only Letters, spaces, dash
      .replace(/\s\s*/g, '<->')
  );
}
