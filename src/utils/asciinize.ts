export default function asciinize(
  s: string,
  length: number = Infinity,
): string {
  const replacements = {
    ae: /ä/g,
    oe: /ö/g,
    ue: /ü/g,
    Ae: /Ä/g,
    Oe: /Ö/g,
    Ue: /Ü/g,
    ss: /ß/g,
  };

  return Object.entries(replacements)
    .reduce((acc, [target, search]) => acc.replace(search, target), s)
    .normalize('NFD') // remove diacritics
    .replace(/[\u0300-\u036f]/g, '')
    .substring(0, length);
}
