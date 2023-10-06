import * as v from 'valibot';

export const isInteger = (str: string): boolean => /^-?\d+$/.test(str as string);

export function IntegerSchema(name: string) {
  return v.transform(
      v.string(`${name} must be a string`,
          [v.custom(isInteger, `${name}: incorrect integer format`)]),
      (obj) => BigInt(obj),
  );
}

export function IntegerSetSchema(name: string) {
  return v.set(IntegerSchema(name));
}

export function parseInteger(name: string, obj: unknown): bigint {
  return v.parse(IntegerSchema(name), obj);
}

export function EmailSchema(name: string) {
  return v.string(`${name} must be a string`,
      [v.email(`${name}: incorrect email format`)]);
}

export const isDate = (str: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(str);

export function DateSchema(name: string) {
  return v.string(`${name} must be a string`,
      [v.custom(isDate, `${name}: incorrect date format`)]);
}