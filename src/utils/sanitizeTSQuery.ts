export default function sanitizeTSQuery(query: string): string {
  console.log(
    query
      // sanitize tsquery: Only Letters, spaces, dash
      .replace(/[^\p{L}0-9- ]/gu, ' '),
    // remove spaces in front and beginning
  );
  return (
    query
      // sanitize tsquery: Only Letters, spaces, dash
      .replace(/[^\p{L}0-9- ]/gu, ' ')
      // remove spaces in front and beginning
      .trim()
      // sanitize tsquery: Only Letters, spaces, dash
      .replace(/\s\s*/g, '<->')
  );
}
