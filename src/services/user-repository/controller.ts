import express from 'express';
import * as v from 'valibot';

import {parseInteger, parseIntegerArraySafe} from '~src/libraries/parsers/common';
import {BaseUserSchema, UserSchema} from './entities';
import {UserRepository} from './service';
import serialize from '~src/libraries/parsers/converter';

export class UserRepositoryController {
  constructor(private readonly repository: UserRepository) {
  }

  public getUserById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json(serialize(await this.repository.getUserById(id)));
  };

  public getUserByName = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const name = req.params['name'];
    res.status(200).json(serialize(await this.repository.getUserByName(name)));
  };

  public doesUserExist = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json(await this.repository.doesUserExist(id));
  };

  public createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userRecord = v.parse(BaseUserSchema, req.body);
    const uid = await this.repository.createUser(userRecord);
    res.status(201).send(serialize(uid));
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
    const idsStr = req.query['ids'];
    const ids = parseIntegerArraySafe('ids', idsStr);
    const users = await this.repository.getUsers(ids);
    let json = users.map(user => serialize(user));
    res.status(200).json(json);
  };
}