import * as v from 'valibot';
import {USER_SCHEMA} from '~services/user-repository/entities';
import {IntegerSchema} from '~src/libraries/parsers/common';

export const LoginRequestSchema = v.object({
  login: v.string('login must be a string',
      [v.minLength(5, 'login must be at least 5 characters long'),
        v.maxLength(32, 'login must be at most 32 characters long')]),
  password: v.string('password must be a string',
      [v.minLength(8, 'password must be at least 8 characters long'),
        v.maxLength(32, 'password must be at most 32 characters long')]),
});

export type LoginRequest = v.Output<typeof LoginRequestSchema>;

export const RegisterRequestSchema = v.object({
  login: v.string('login must be a string',
      [v.minLength(5, 'login must be at least 5 characters long'),
        v.maxLength(32, 'login must be at most 32 characters long')]),
  password: v.string('password must be a string',
      [v.minLength(8, 'password must be at least 8 characters long'),
        v.maxLength(32, 'password must be at most 32 characters long')]),
  secret: v.optional(v.string('secret must be a string')),
  ...USER_SCHEMA,
});

export type RegisterRequest = v.Output<typeof RegisterRequestSchema>;

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Status {
  UNAUTHENTICATED = 'unauthenticated',
  ACTIVE = 'active',
  BANNED = 'banned',
}

export const USER_INFO = {
  uid: IntegerSchema('uid'),
  role: v.nativeEnum(Role, 'role must be a valid Role'),
  status: v.nativeEnum(Status, 'status must be a valid Status'),
};

export const UserInfoSchema = v.object(USER_INFO);

export type UserInfo = v.Output<typeof UserInfoSchema>;

export const UpdateInfoRequestSchema = v.object({
  ...USER_INFO,
});

export type UpdateInfoRequest = v.Output<typeof UpdateInfoRequestSchema>;

export const UserInfoEntrySchema = UpdateInfoRequestSchema;

export type UserInfoEntry = v.Output<typeof UpdateInfoRequestSchema>;