import path from 'path';
import fs from 'fs';

import * as v from 'valibot';

import {__data_dir} from '~src/config';
import {User, UserRecord, UserSchema} from './entities';
import {NotFoundError} from '~src/types/errors';
import serialize from '~src/libraries/parsers/converter';

export class UserRepository {
  private static readonly SAVE_FILENAME = path.join(__data_dir, 'user-repository.json');

  private users: Map<bigint, User> = new Map();

  constructor() {
    this.load();
  }

  public async getUsers(ids?: bigint[]): Promise<User[]> {
    if (ids === undefined) {
      return [...this.users.values()];
    } else {
      const result = [];
      for (const id of ids) {
        if (this.users.has(id)) {
          result.push(this.users.get(id)!);
        }
      }
      return result;
    }
  }

  public async getUserById(id: bigint): Promise<User> {
    if (!this.users.has(id)) {
      throw new NotFoundError(`User with id ${id} does not exist`);
    }
    return this.users.get(id)!;
  }

  public async getUserByName(name: string): Promise<User> {
    for (const user of this.users.values()) {
      if (user.name === name) {
        return user;
      }
    }
    throw new NotFoundError(`User with name ${name} does not exist`);
  }

  public async doesUserExist(id: bigint): Promise<boolean> {
    return this.users.has(id);
  }

  public async createUser(userRecord: UserRecord): Promise<void> {
    const user = User.fromRecord(userRecord);
    this.users.set(user.id, user);
  }

  public async updateUser(userEntity: UserRecord): Promise<void> {
    if (!this.users.has(userEntity.id)) {
      throw new NotFoundError(`User with id ${userEntity.id} does not exist`);
    }
    const user = User.fromRecord(userEntity);
    this.users.set(user.id, user);
  }

  public async deleteUser(id: bigint): Promise<void> {
    if (!this.users.has(id)) {
      throw new NotFoundError(`User with id ${id} does not exist`);
    }
    this.users.delete(id);
  }

  private load() {
    if (!fs.existsSync(UserRepository.SAVE_FILENAME)) {
      console.log(`[UserRepository] File ${UserRepository.SAVE_FILENAME} does not exist`);
      return;
    }
    let data = fs.readFileSync(UserRepository.SAVE_FILENAME, 'utf8');
    let users: UserRecord[];
    try {
      users = v.parse(v.array(UserSchema), JSON.parse(data));
    } catch (e) {
      console.warn(`[UserRepository] Failed to parse users data`);
      console.log(e);
      return;
    }
    for (const user of users) {
      this.users.set(user.id, User.fromRecord(user));
    }
    console.log(`[UserRepository] Loaded users from ${UserRepository.SAVE_FILENAME}`);
  }

  public async save(): Promise<void> {
    const json = [];
    for (const user of this.users.values()) {
      json.push(serialize(user));
    }
    const data = JSON.stringify(json);
    if (!fs.existsSync(path.dirname(UserRepository.SAVE_FILENAME))) {
      fs.mkdirSync(path.dirname(UserRepository.SAVE_FILENAME));
      console.log(`[UserRepository] Created directory ${path.dirname(UserRepository.SAVE_FILENAME)}`);
    }
    fs.writeFile(UserRepository.SAVE_FILENAME, data, (err) => {
      if (err) {
        console.warn(`[UserRepository] Failed to save users to ${UserRepository.SAVE_FILENAME}`);
        throw err;
      }
      console.log(`[UserRepository] Saved users to ${UserRepository.SAVE_FILENAME}`);
    });
  }
}