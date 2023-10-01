import * as v from 'valibot';

export function parseInteger(name: string, obj: any): bigint {
  const IntegerSchema = v.bigint(`${name} must be an integer`);
  return v.parse(IntegerSchema, obj);
}