import express from 'express';
import * as v from 'valibot';

import {parseInteger, parseIntegerArray} from '~src/libraries/parsers/common';
import {BaseChatSchema, MessageSchema} from './entities';
import {ChatRepository} from './service';
import serialize from '~src/libraries/parsers/converter';

export class ChatRepositoryController {
  constructor(private readonly repository: ChatRepository) {
  }

  public getChats = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ids = parseIntegerArray('chatIds', req.query['ids']);
    res.status(200).json(serialize(await this.repository.getChats(ids)));
  }

  public getUserChats = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const uid = parseInteger('uid', req.params['uid']);
    res.status(200).json(serialize(await this.repository.getUserChats(uid)));
  }

  public doesChatExist = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json(serialize(await this.repository.doesChatExist(id)));
  }

  public addChat = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const chat = v.parse(BaseChatSchema, req.body);
    res.status(201).send(serialize(await this.repository.addChat(chat)));
  }

  public deleteChat = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    await this.repository.deleteChat(id);
    res.status(200).send();
  }

  public addMessageToChat = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    const message = v.parse(MessageSchema, req.body);
    res.status(200).send(serialize(await this.repository.addMessageToChat(id, message)));
  }

  public save = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await this.repository.save();
    res.status(200).send();
  };
}