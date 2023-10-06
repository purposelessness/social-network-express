import * as v from 'valibot';

import {DateSchema, EmailSchema, IntegerSchema} from '~src/parsers/common';
import {Jsonable, Stringable} from '~src/types/utilities';

const BASE_USER_SCHEMA = {
  name: v.string('Name must be a string'),
  email: v.optional(EmailSchema('email')),
  birthDate: v.optional(DateSchema('birthDate')),
};

export const BaseUserSchema = v.object({...BASE_USER_SCHEMA});
export type BaseUserRecord = v.Output<typeof BaseUserSchema>;

export const UserSchema = v.object({
  id: IntegerSchema('id'),
  ...BASE_USER_SCHEMA,
});
export type UserRecord = v.Output<typeof UserSchema>;

export class User implements Stringable, Jsonable {
  constructor(
      public readonly id: bigint,
      public name: string,
      public email?: string,
      public birthDate?: string,
  ) {
  }

  public static fromBaseRecord(id: bigint, record: BaseUserRecord): User {
    return new User(id, record.name, record.email, record.birthDate);
  }

  public static fromRecord(record: UserRecord): User {
    return new User(record.id, record.name, record.email, record.birthDate);
  }

  public toJson(): any {
    return {
      id: this.id.toString(),
      name: this.name,
      email: this.email,
      birthDate: this.birthDate,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }
}