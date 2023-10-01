import * as v from 'valibot';

const BASE_USER_SCHEMA = {
  name: v.string('Name must be a string'),
  email: v.string('Email must be a string',
      [v.email('Incorrect email format')]),
  birthDate: v.date('Incorrect birth date format'),
};

export const BaseUserSchema = v.object({...BASE_USER_SCHEMA});
export type BaseUserInput = v.Output<typeof BaseUserSchema>;

export const UserSchema = v.object({
  id: v.bigint('Id must be an integer'),
  ...BASE_USER_SCHEMA,
});
export type UserInput = v.Output<typeof UserSchema>;
