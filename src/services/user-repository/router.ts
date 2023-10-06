import {Router} from 'express';

import {safeCall} from '~src/utilities';
import {UserRepositoryController} from './controller';

export class UserRepositoryRouter {
  constructor(private readonly controller: UserRepositoryController) {
  }

  public getRouter() {
    const router = Router();

    router.get('/', safeCall(this.controller.getUsers));
    router.get('/:id(\\d+)', safeCall(this.controller.getUserById));
    router.get('/name/:name', safeCall(this.controller.getUserByName));
    router.post('/', safeCall(this.controller.createUser));
    router.put('/', safeCall(this.controller.updateUser));
    router.delete('/:id(\\d+)', safeCall(this.controller.deleteUser));
    router.post('/save', safeCall(this.controller.save));

    return router;
  }
}