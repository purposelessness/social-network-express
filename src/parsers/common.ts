import * as v from 'valibot';

export function parseInteger(name: string, obj: any): bigint {
  const IntegerSchema = v.bigint(`${name} must be an integer`);
  return v.parse(IntegerSchema, obj);
}

export function EmailSchema(name: string) {
  return v.string(`${name} must be a string`,
      [v.email(`${name}: incorrect email format`)]);
}


export const isDateString = (str: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(str);

export function DateSchema(name: string) {
  return v.string(`${name} must be a string`,
      [v.custom(isDateString, `${name}: incorrect date format`)]);
}