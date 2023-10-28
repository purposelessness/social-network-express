import {Router} from 'express';

import {safeCall} from '~src/libraries/utilities';
import {UserToNewsRepositoryController} from './controller';

export class UserToNewsRepositoryRouter {
  constructor(private readonly controller: UserToNewsRepositoryController) {
  }

  public getRouter() {
    const router = Router();

    router.get('/', safeCall(this.controller.getEntries));
    router.get('/:id(\\d+)', safeCall(this.controller.getEntryById));
    router.post('/', safeCall(this.controller.addLink));
    router.delete('/', safeCall(this.controller.deleteLink));
    router.post('/save', safeCall(this.controller.save));

    return router;
  }
}