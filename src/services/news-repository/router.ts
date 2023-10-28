import {Router} from 'express';

import {safeCall} from '~src/libraries/utilities';
import {NewsRepositoryController} from './controller';

export class NewsRepositoryRouter {
  constructor(private readonly controller: NewsRepositoryController) {
  }

  public getRouter() {
    const router = Router();

    router.get('/', safeCall(this.controller.getNewsList));
    router.get('/:id(\\d+)', safeCall(this.controller.getNews));
    router.get('/exists/:id(\\d+)', safeCall(this.controller.doesNewsExist));
    router.post('/', safeCall(this.controller.addNews));
    router.delete('/:id(\\d+)', safeCall(this.controller.deleteNews));
    router.post('/save', safeCall(this.controller.save));

    return router;
  }
}