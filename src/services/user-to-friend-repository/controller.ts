import express from 'express';
import * as v from 'valibot';

import {parseInteger} from '~src/libraries/parsers/common';
import {RequestSchema} from './entities';
import {UserToFriendRepository} from './service';

export class UserToFriendRepositoryController {
  constructor(private readonly repository: UserToFriendRepository) {
  }

  public getEntries = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json(await this.repository.getEntries());
  };

  public getEntryById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json(await this.repository.getEntryById(id));
  };

  public addFriend = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(RequestSchema, req.body);
    await this.repository.addFriend(request);
    res.status(200).send();
  };

  public deleteFriend = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(RequestSchema, req.body);
    await this.repository.deleteFriend(request);
    res.status(200).send();
  };

  public save = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await this.repository.save();
    res.status(200).send();
  };
}