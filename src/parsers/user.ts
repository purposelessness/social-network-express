import * as v from 'valibot';
import {DateSchema, EmailSchema} from '~src/parsers/common';

const BASE_USER_SCHEMA = {
  name: v.string('Name must be a string'),
  email: EmailSchema('email'),
  birthDate: DateSchema('birthDate'),
};

export const BaseUserSchema = v.object({...BASE_USER_SCHEMA});
export type BaseUserInput = v.Output<typeof BaseUserSchema>;

export const UserSchema = v.object({
  id: v.bigint('Id must be an integer'),
  ...BASE_USER_SCHEMA,
});
export type UserInput = v.Output<typeof UserSchema>;
