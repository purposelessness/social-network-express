import * as v from 'valibot';

export const isIntegerString = (str: string): boolean => /^-?\d+$/.test(str as string);

export function IntegerSchema(name: number | string) {
  const integerSchema = v.number('${name} must be an integer',
      [v.integer(`${name} must be an integer`)]);
  const integerStringSchema = v.string(`${name} must be a string`,
      [v.custom(isIntegerString, `${name}: incorrect integer format`)]);

  return v.transform(
      v.union([integerSchema, integerStringSchema], `${name} must be an integer or a string of an integer`),
      (obj) => BigInt(obj),
  );
}

export function parseInteger(name: string, obj: unknown): bigint {
  return v.parse(IntegerSchema(name), obj);
}

export function parseIntegerArray(name: string, obj: unknown): bigint[] {
  const arrayRegex = /^(\d+\s*,?\s*)+$/;
  if (typeof obj === 'string' && arrayRegex.test(obj)) {
    obj = obj.split(',').map((str) => str.trim());
  }
  return v.parse(v.array(IntegerSchema(name), `${name} is not an array`), obj);
}

export function EmailSchema(name: string) {
  return v.string(`${name} must be a string`,
      [v.email(`${name}: incorrect email format`)]);
}

export const isDate = (str: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(str);
export const isFullDate = (str: string): boolean => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(str);

export function DateSchema(name: string) {
  return v.string(`${name} must be a string`,
      [v.custom(isDate, `${name}: incorrect date format`)]);
}

export function FullDateSchema(name: string) {
  return v.string(`${name} must be a string`,
      [v.custom(isFullDate, `${name}: incorrect full date format`)]);
}
