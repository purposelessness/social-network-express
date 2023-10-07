import express from 'express';

import {parseInteger} from '~src/libraries/parsers/common';
import {NewsFeedService} from './service';
import serialize from '~src/libraries/parsers/converter';

export class NewsFeedController {
  constructor(private readonly service: NewsFeedService) {
  }

  public generateNewsFeed = async (req: express.Request, res: express.Response): Promise<void> => {
    const uid = parseInteger('uid', req.params['id']);
    res.status(200).send(serialize(await this.service.generateNewsFeed(uid)));
  };
}