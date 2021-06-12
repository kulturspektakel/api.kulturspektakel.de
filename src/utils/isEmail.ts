import {validate} from 'email-validator';

export default function (string: string): boolean {
  return validate(string);
}
