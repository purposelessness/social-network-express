import {Router} from 'express';

import {safeCall} from '~src/libraries/utilities';
import {NewsFeedController} from './controller';

export class NewsFeedRouter {
  constructor(private readonly controller: NewsFeedController) {
  }

  public getRouter() {
    const router = Router();

    router.get('/:id(\\d+)', safeCall(this.controller.generateNewsFeed));

    return router;
  }
}