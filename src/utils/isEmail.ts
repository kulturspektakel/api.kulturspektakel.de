import emailRegex from 'email-regex';

export default function (string: string): boolean {
  return emailRegex({exact: true}).test(string);
}
