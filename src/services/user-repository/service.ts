import path from 'path';
import fs from 'fs';

import {__src_dir} from '~src/config';
import {User, UserEntryRecord, UserRecord} from './entities';
import {NotFoundError} from '~src/types/errors';
import serialize from '~src/libraries/parsers/converter';

export class UserRepository {
  private static readonly SAVE_FILENAME = path.join(__src_dir, 'data', 'user-repository.json');
  private static UNIQUE_ID = 0n;

  private users: Map<bigint, User> = new Map();

  public async getUsers(): Promise<User[]> {
    return [...this.users.values()];
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

  public async createUser(userEntity: UserRecord): Promise<bigint> {
    const user = new User(UserRepository.UNIQUE_ID++, userEntity.name, userEntity.email, userEntity.birthDate);
    this.users.set(user.id, user);
    return user.id;
  }

  public async updateUser(userEntity: UserEntryRecord): Promise<void> {
    if (!this.users.has(userEntity.id)) {
      throw new NotFoundError(`User with id ${userEntity.id} does not exist`);
    }
    const user = new User(userEntity.id, userEntity.name, userEntity.email, userEntity.birthDate);
    this.users.set(user.id, user);
  }

  public async deleteUser(id: bigint): Promise<void> {
    if (!this.users.has(id)) {
      throw new NotFoundError(`User with id ${id} does not exist`);
    }
    this.users.delete(id);
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