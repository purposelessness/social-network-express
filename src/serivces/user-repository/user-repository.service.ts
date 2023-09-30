import path from 'path';
import fs from 'fs';

import {__src_dir} from "~src/config";
import {User} from './user-repository.entities';

export class UserRepository {
  private static readonly SAVE_FILENAME = path.join(__src_dir, 'data', 'users.json');

  private users: User[] = [];

  public async getUserById(id: number): Promise<User> {
    if (id >= this.users.length) {
      throw new Error(`User with id ${id} does not exist`);
    }
    return this.users[id];
  }

  public async getUserByName(name: string): Promise<User> {
    let user = this.users.find((user) => user.name === name);
    if (!user) {
      throw new Error(`User with name ${name} does not exist`);
    }
    return user;
  }

  public async createUser(name: string): Promise<User> {
    const user = new User(this.users.length, name);
    this.users.push(user);
    return user;
  }

  public async updateUser(user: User): Promise<void> {
    this.users[user.id] = user;
  }

  public async save(): Promise<void> {
    const json = this.users.map((user) => user.toJson());
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