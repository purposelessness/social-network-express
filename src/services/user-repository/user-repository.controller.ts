import express from 'express';
import * as v from 'valibot';

import {parseInteger} from '~src/parsers/common';
import {BaseUserSchema, UserSchema} from '~src/parsers/user';
import {User} from './user-repository.entities';
import {UserRepository} from './user-repository.service';

export class UserRepositoryController {
  constructor(private readonly userRepository: UserRepository) {
  }

  public getUserById = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<User | undefined> => {
    const id = parseInteger('id', req.params['id']);
    return this.userRepository.getUserById(id);
  };

  public getUserByName = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<User | undefined> => {
    const name = req.params['name'];
    return this.userRepository.getUserByName(name);
  };

  public createUser = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<User | undefined> => {
    const userEntity = v.parse(BaseUserSchema, req.body);
    return this.userRepository.createUser(userEntity);
  };

  public updateUser = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const userEntity = v.parse(UserSchema, req.body);
    return this.userRepository.updateUser(userEntity);
  };

  public deleteUser = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const id = parseInteger('id', req.params['id']);
    return this.userRepository.deleteUser(id);
  };

  public save = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    return this.userRepository.save();
  };

  public async getUsers(): Promise<User[]> {
    return this.userRepository.getUsers();
  }
}