import path from 'path';

import express from 'express';

import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from 'jsonwebtoken';
import * as v from 'valibot';

import {__data_dir, __tvm_key, __url} from '~src/config';
import {
  LoginRequest,
  RegisterRequest,
  Role,
  Status,
  UpdateInfoRequest,
  UserInfo,
  UserInfoEntry,
  UserInfoEntrySchema,
} from './entities';
import {ClientError, NotFoundError, ServerError} from '~src/types/errors';
import {BaseUserRecord, UserRecord} from '~services/user-repository/entities';
import serialize from '~src/libraries/parsers/converter';
import fs from 'fs';

export class AuthProxyService {
  private static readonly AUTH_FILENAME = path.join(__data_dir, 'auth.json');
  private static readonly UIDS_FILENAME = path.join(__data_dir, 'uids.json');
  private static readonly USER_INFOS_FILENAME = path.join(__data_dir, 'user-infos.json');

  private static readonly SALT_ROUNDS = 10;
  private static readonly SECRET_KEY = 'secret';
  private static readonly TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7; // 1 week

  private static UNIQUE_ID = 0n;

  private readonly authData: Map<string, string> = new Map();
  private readonly uids: Map<string, bigint> = new Map();
  private readonly infos: Map<bigint, UserInfo> = new Map();

  constructor() {
    this.loadUserInfosData();
  }

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
      uid: this.uids.get(request.login)!.toString(),
      info: this.infos.get(this.uids.get(request.login)!)!,
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
      this.infos.set(uid, {
        role: Role.ADMIN,
        status: Status.ACTIVE,
      });
    } else {
      this.infos.set(uid, {
        role: Role.USER,
        status: Status.UNAUTHENTICATED,
      });
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
        console.log(this.infos);
        if (!this.isTokenValid(payload)) {
          console.warn(`[AuthProxyService] Token is not valid`);
          throw new ClientError('User is not authorized', 401);
        }
        request.body.authContext = {
          uid: payload['uid'],
        };
      });
    }
  };

  public getInfo = async (uid: bigint): Promise<UserInfo> => {
    if (!this.infos.has(uid)) {
      throw new NotFoundError('User is not found');
    }
    return this.infos.get(uid)!;
  };

  public updateInfo = async (request: UpdateInfoRequest): Promise<void> => {
    const uid = request.uid;
    if (!this.infos.has(uid)) {
      throw new NotFoundError('User is not found');
    }

    this.infos.set(uid, {
      role: request.role,
      status: request.status,
    });
    console.info(`[AuthProxyService] Updated info for user with id ${uid}: ${JSON.stringify(serialize(this.infos.get(uid)))}`);
  };

  public permit = async (uid: bigint | undefined, requestedRole: Role, requestedStatus: Status) => {
    if (uid == null) {
      throw new NotFoundError('User is not found');
    }
    if (!this.infos.has(uid)) {
      throw new NotFoundError('User is not found');
    }
    const info = this.infos.get(uid)!;
    if (info.role != requestedRole || info.status != requestedStatus) {
      throw new ClientError('You don\'t have enough permissions', 403);
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
    if (!this.infos.has(uid)) {
      throw new NotFoundError('User is not found');
    }

    const info = this.infos.get(uid)!;
    return info.role === jwtPayload['role'] && info.status === jwtPayload['status'];
  }

  private loadUserInfosData() {
    if (!fs.existsSync(AuthProxyService.USER_INFOS_FILENAME)) {
      console.log(`[AuthProxyService] File ${AuthProxyService.USER_INFOS_FILENAME} does not exist`);
      return;
    }
    let data = fs.readFileSync(AuthProxyService.USER_INFOS_FILENAME, 'utf8');
    let entries: UserInfoEntry[];
    try {
      entries = v.parse(v.array(UserInfoEntrySchema), JSON.parse(data));
    } catch (e) {
      console.warn(`[AuthProxyService] Failed to parse user-infos data ${e}}`);
      return;
    }
    for (const entry of entries) {
      this.infos.set(entry.uid, {role: entry.role, status: entry.status});
    }
    console.log(`[AuthProxyService] Loaded user-infos data from ${AuthProxyService.USER_INFOS_FILENAME}`);
  }
}