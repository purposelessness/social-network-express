import express from 'express';
import * as v from 'valibot';

import {parseInteger} from '~src/parsers/common';
import {BaseUserSchema, UserSchema} from '~src/parsers/user';
import {UserRepository} from './user-repository.service';

export class UserRepositoryController {
  constructor(private readonly userRepository: UserRepository) {
  }

  public getUserById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json((await this.userRepository.getUserById(id)).toJson());
  };

  public getUserByName = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const name = req.params['name'];
    res.status(200).json((await this.userRepository.getUserByName(name)).toJson());
  };

  public createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userEntity = v.parse(BaseUserSchema, req.body);
    res.status(201).json((await this.userRepository.createUser(userEntity)).toJson());
  };

  public updateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userEntity = v.parse(UserSchema, req.body);
    await this.userRepository.updateUser(userEntity);
    res.status(200);
  };

  public deleteUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    await this.userRepository.deleteUser(id);
    res.status(200);
  };

  public save = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await this.userRepository.save();
    res.status(200);
  };

  public getUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let json = [];
    for (const user of await this.userRepository.getUsers()) {
      json.push(user.toJson());
    }
    res.status(200).json(json);
  }
}