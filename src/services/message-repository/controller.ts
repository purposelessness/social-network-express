import express from 'express';
import * as v from 'valibot';

import {parseInteger, parseIntegerArray} from '~src/libraries/parsers/common';
import {MessageSchema} from './entities';
import {MessageRepository} from './service';
import serialize from '~src/libraries/parsers/converter';

export class MessageRepositoryController {
  constructor(private readonly repository: MessageRepository) {
  }

  public getMessages = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ids = parseIntegerArray('messageIds', req.query['ids']);
    res.status(200).json(serialize(await this.repository.getMessages(ids)));
  };

  public getMessage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json(serialize(await this.repository.getMessage(id)));
  };

  public doesMessageExist = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json(serialize(await this.repository.doesMessageExist(id)));
  };

  public addMessage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const message = v.parse(MessageSchema, req.body);
    res.status(201).send(serialize(await this.repository.addMessage(message)));
  };

  public deleteMessage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    await this.repository.deleteMessage(id);
    res.status(200).send();
  };

  public save = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await this.repository.save();
    res.status(200).send();
  };
}