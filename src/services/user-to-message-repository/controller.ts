import express from 'express';
import * as v from 'valibot';

import {parseInteger} from '~src/parsers/common';
import {RequestSchema} from './entities';
import {UserToMessageRepository} from './service';
import serialize from '~src/parsers/converter';

export class UserToMessageRepositoryController {
  constructor(private readonly repository: UserToMessageRepository) {
  }

  public getEntries = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json(serialize(await this.repository.getEntries()));
  };

  public getEntryById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json(serialize(await this.repository.getEntryById(id)));
  };

  public addMessage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(RequestSchema, req.body);
    await this.repository.addMessage(request);
    res.status(200).send();
  };

  public deleteMessage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(RequestSchema, req.body);
    await this.repository.deleteMessage(request);
    res.status(200).send();
  };

  public save = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await this.repository.save();
    res.status(200).send();
  };
}