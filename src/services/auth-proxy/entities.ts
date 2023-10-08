import * as v from 'valibot';
import {USER_SCHEMA} from '~services/user-repository/entities';

export const LoginRequestScheme = v.object({
  login: v.string('login must be a string',
      [v.minLength(5, 'login must be at least 5 characters long'),
        v.maxLength(32, 'login must be at most 32 characters long')]),
  password: v.string('password must be a string',
      [v.minLength(8, 'password must be at least 8 characters long'),
        v.maxLength(32, 'password must be at most 32 characters long')]),
});

export type LoginRequest = v.Output<typeof LoginRequestScheme>;

export const RegisterRequestScheme = v.object({
  login: v.string('login must be a string',
      [v.minLength(5, 'login must be at least 5 characters long'),
        v.maxLength(32, 'login must be at most 32 characters long')]),
  password: v.string('password must be a string',
      [v.minLength(8, 'password must be at least 8 characters long'),
        v.maxLength(32, 'password must be at most 32 characters long')]),
  secret: v.optional(v.string('secret must be a string')),
  ...USER_SCHEMA,
});

export type RegisterRequest = v.Output<typeof RegisterRequestScheme>;

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}