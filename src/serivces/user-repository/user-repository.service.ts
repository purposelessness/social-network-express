import path from 'path';
import fs from 'fs';

import {__src_dir} from "~src/config";
import {IUserEntity, User} from './user-repository.entities';

export class UserRepository {
  private static readonly SAVE_FILENAME = path.join(__src_dir, 'data', 'users.json');
  private static UNIQUE_ID = 0;

  private users: Map<number, User> = new Map();

  public async getUserById(id: number): Promise<User> {
    if (!this.users.has(id)) {
      throw new Error(`User with id ${id} does not exist`);
    }
    return this.users.get(id)!;
  }

  public async getUserByName(name: string): Promise<User> {
    for (const user of this.users.values()) {
      if (user.name === name) {
        return user;
      }
    }
    throw new Error(`User with name ${name} does not exist`);
  }

  public async createUser(userEntity: IUserEntity): Promise<User> {
    const user = new User(UserRepository.UNIQUE_ID++, userEntity.name);
    this.users.set(user.id, user);
    return user;
  }

  public async updateUser(userEntity: Required<IUserEntity>): Promise<void> {
    if (!this.users.has(userEntity.id)) {
      throw new Error(`User with id ${userEntity.id} does not exist`);
    }
    const user = new User(userEntity.id, userEntity.name);
    this.users.set(user.id, user);
  }

  public async save(): Promise<void> {
    const json = [];
    for (const user of this.users.values()) {
      json.push(user.toJson());
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