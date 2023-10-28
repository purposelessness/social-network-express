import express from 'express';
import * as v from 'valibot';

import {parseInteger} from '~src/libraries/parsers/common';
import {RequestSchema} from './entities';
import {UserToNewsRepository} from './service';
import serialize from '~src/libraries/parsers/converter';

export class UserToNewsRepositoryController {
  constructor(private readonly repository: UserToNewsRepository) {
  }

  public getEntries = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json(serialize(await this.repository.getEntries()));
  };

  public getEntryById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json(serialize(await this.repository.getEntryById(id)));
  };

  public addLink = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(RequestSchema, req.body);
    await this.repository.addLink(request);
    res.status(200).send();
  };

  public deleteLink = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(RequestSchema, req.body);
    await this.repository.deleteLink(request);
    res.status(200).send();
  };

  public save = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await this.repository.save();
    res.status(200).send();
  };
}