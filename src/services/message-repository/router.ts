import {Router} from 'express';

import {safeCall} from '~src/libraries/utilities';
import {MessageRepositoryController} from './controller';

export class UserRepositoryRouter {
  constructor(private readonly controller: MessageRepositoryController) {
  }

  public getRouter() {
    const router = Router();

    router.get('/', safeCall(this.controller.getMessages));
    router.get('/:id(\\d+)', safeCall(this.controller.getMessage));
    router.get('/exists/:id(\\d+)', safeCall(this.controller.doesMessageExist));
    router.post('/', safeCall(this.controller.addMessage));
    router.delete('/:id(\\d+)', safeCall(this.controller.deleteMessage));
    router.post('/save', safeCall(this.controller.save));

    return router;
  }
}