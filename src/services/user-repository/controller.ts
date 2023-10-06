import express from 'express';
import * as v from 'valibot';

import {parseInteger} from '~src/parsers/common';
import {BaseUserSchema, UserSchema} from './entities';
import {UserRepository} from './service';

export class UserRepositoryController {
  constructor(private readonly repository: UserRepository) {
  }

  public getUserById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json((await this.repository.getUserById(id)).toJson());
  };

  public getUserByName = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const name = req.params['name'];
    res.status(200).json((await this.repository.getUserByName(name)).toJson());
  };

  public createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userEntity = v.parse(BaseUserSchema, req.body);
    const userId = await this.repository.createUser(userEntity);
    res.status(201).send(userId.toString());
  };

  public updateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userEntity = v.parse(UserSchema, req.body);
    await this.repository.updateUser(userEntity);
    res.status(200).send();
  };

  public deleteUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    await this.repository.deleteUser(id);
    res.status(200).send(id.toString());
  };

  public save = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await this.repository.save();
    res.status(200).send();
  };

  public getUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let json = [];
    for (const user of await this.repository.getUsers()) {
      json.push(user.toJson());
    }
    res.status(200).json(json);
  }
}