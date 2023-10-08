import path from 'path';

import express from 'express';

import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from 'jsonwebtoken';

import {__src_dir, __tvm_key, __url} from '~src/config';
import {LoginRequest, RegisterRequest, Role} from './entities';
import {ClientError, NotFoundError, ServerError} from '~src/types/errors';
import {BaseUserRecord, UserRecord} from '~services/user-repository/entities';
import serialize from '~src/libraries/parsers/converter';

export class AuthProxyService {
  private static readonly AUTH_FILENAME = path.join(__src_dir, 'data', 'auth.json');
  private static readonly UIDS_FILENAME = path.join(__src_dir, 'data', 'uids.json');
  private static readonly ROLES_FILENAME = path.join(__src_dir, 'data', 'roles.json');

  private static readonly SALT_ROUNDS = 10;
  private static readonly SECRET_KEY = 'secret';
  private static readonly TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7; // 1 week

  private static UNIQUE_ID = 0n;

  private readonly authData: Map<string, string> = new Map();
  private readonly uids: Map<string, bigint> = new Map();
  private readonly roles: Map<bigint, Role> = new Map();

  public login = async (request: LoginRequest): Promise<string> => {
    if (!this.authData.has(request.login)) {
      throw new NotFoundError('User not found');
    }
    const password = this.authData.get(request.login)!;
    const match = await bcrypt.compare(request.password, password);
    if (!match) {
      throw new ClientError('Wrong password');
    }

    const payload = {
      uid: this.uids.get(request.login)?.toString(),
      role: this.roles.get(this.uids.get(request.login)!),
    };
    return jwt.sign(payload, AuthProxyService.SECRET_KEY, {
      expiresIn: AuthProxyService.TOKEN_EXPIRATION_TIME,
    });
  };

  public register = async (request: RegisterRequest): Promise<void> => {
    if (this.authData.has(request.login)) {
      throw new ClientError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(request.password, AuthProxyService.SALT_ROUNDS);
    this.authData.set(request.login, hashedPassword);

    const uid = AuthProxyService.UNIQUE_ID++;
    this.uids.set(request.login, uid);

    if (request.secret === AuthProxyService.SECRET_KEY) {
      this.roles.set(uid, Role.ADMIN);
    } else {
      this.roles.set(uid, Role.USER);
    }

    await this.createUser(uid, {
      name: request.name,
      email: request.email,
      birthDate: request.birthDate,
    });
  };

  public auth = async (request: express.Request): Promise<void> => {
    let token = request.headers.authorization;
    if (!token) {
      console.warn('[AuthProxyService] Token is not provided');
      throw new ClientError('User is not authorized', 401);
    } else if (token === 'TVM-key') {
      console.log('[AuthProxyService] TVM-key is provided');
      request.body.authContext = {
        uid: 0n,
        role: Role.ADMIN,
      };
    } else {
      token = token.replace('Bearer ', '');
      jwt.verify(token, AuthProxyService.SECRET_KEY, (err, decoded) => {
        if (err) {
          console.warn(`[AuthProxyService] Error on verifying token: ${err}`);
          throw new ClientError('User is not authorized', 401);
        }
        const payload = decoded as JwtPayload;
        console.log(payload);
        console.log(this.roles);
        if (!this.isTokenValid(payload)) {
          console.warn(`[AuthProxyService] Token is not valid`);
          throw new ClientError('User is not authorized', 401);
        }
        request.body.authContext = {
          uid: payload['uid'],
          role: payload['role'],
        };
      });
    }
  };

  private async createUser(uid: bigint, baseUserRecord: BaseUserRecord) {
    const userRecord: UserRecord = {
      id: uid,
      ...baseUserRecord,
    };
    const response = await fetch(`${__url}/api/user-repository`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: __tvm_key,
      },
      body: JSON.stringify(serialize(userRecord)),
    });

    if (!response.ok) {
      console.error(`[AuthProxyService] Error on registering user with id ${uid}: ${response.statusText}`);
      throw new ServerError(`Failed to register user with id ${uid}`);
    }
  }

  private isTokenValid(jwtPayload: JwtPayload): boolean {
    if (!jwtPayload['uid'] || !jwtPayload['role']) {
      return false;
    }
    const uid = BigInt(jwtPayload['uid']);
    return this.roles.get(uid) === jwtPayload['role'];
  }
}