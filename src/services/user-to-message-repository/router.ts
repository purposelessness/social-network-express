import {Router} from 'express';

import {safeCall} from '~src/libraries/utilities';
import {UserToMessageRepositoryController} from './controller';

export class UserToMessageRepositoryRouter {
  constructor(private readonly controller: UserToMessageRepositoryController) {
  }

  public getRouter() {
    const router = Router();

    router.get('/', safeCall(this.controller.getEntries));
    router.get('/:id(\\d+)', safeCall(this.controller.getEntryById));
    router.post('/', safeCall(this.controller.addMessage));
    router.delete('/', safeCall(this.controller.deleteMessage));
    router.post('/save', safeCall(this.controller.save));

    return router;
  }
}