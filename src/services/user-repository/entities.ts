import * as v from 'valibot';

import {DateSchema, EmailSchema, IntegerSchema} from '~src/libraries/parsers/common';

const USER_SCHEMA = {
  name: v.string('Name must be a string'),
  email: EmailSchema('email'),
  birthDate: DateSchema('birthDate'),
};

export const UserSchema = v.object({...USER_SCHEMA});
export type UserRecord = v.Output<typeof UserSchema>;

export const UserEntrySchema = v.object({
  id: IntegerSchema('id'),
  ...USER_SCHEMA,
});
export type UserEntryRecord = v.Output<typeof UserEntrySchema>;

export class User {
  constructor(
      public readonly id: bigint,
      public name: string,
      public email: string,
      public birthDate: string,
  ) {
  }

  public static fromRecord(id: bigint, record: UserRecord): User {
    return new User(id, record.name, record.email, record.birthDate);
  }

  public static fromEntryRecord(record: UserEntryRecord): User {
    return new User(record.id, record.name, record.email, record.birthDate);
  }
}