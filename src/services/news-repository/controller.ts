import express from 'express';
import * as v from 'valibot';

import {parseInteger, parseIntegerArray} from '~src/libraries/parsers/common';
import {NewsSchema} from './entities';
import {NewsRepository} from './service';
import serialize from '~src/libraries/parsers/converter';

export class NewsRepositoryController {
  constructor(private readonly repository: NewsRepository) {
  }

  public getNewsList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ids = parseIntegerArray('newsListIds', req.query['ids']);
    res.status(200).json(serialize(await this.repository.getNewsList(ids)));
  };

  public getNews = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json(serialize(await this.repository.getNews(id)));
  };

  public doesNewsExist = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    res.status(200).json(serialize(await this.repository.doesNewsExist(id)));
  };

  public addNews = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const news = v.parse(NewsSchema, req.body);
    res.status(201).send(serialize(await this.repository.addNews(news)));
  };

  public deleteNews = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = parseInteger('id', req.params['id']);
    await this.repository.deleteNews(id);
    res.status(200).send();
  };

  public save = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await this.repository.save();
    res.status(200).send();
  };
}