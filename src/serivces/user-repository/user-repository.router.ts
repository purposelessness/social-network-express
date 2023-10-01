import {Router} from 'express';

import {safeCall} from '~src/utilities';
import {UserRepositoryController} from './user-repository.controller';

export class UserRepositoryRouter {
  constructor(private readonly userRepositoryController: UserRepositoryController) {
  }

  public getRouter() {
    const router = Router();

    router.get('/user', safeCall(this.userRepositoryController.getUsers));
    router.get('/user/:id(\\d+)', safeCall(this.userRepositoryController.getUserById));
    router.get('/user/name/:name', safeCall(this.userRepositoryController.getUserByName));
    router.post('/user', safeCall(this.userRepositoryController.createUser));
    router.put('/user', safeCall(this.userRepositoryController.updateUser));
    router.delete('/user/:id(\\d+)', safeCall(this.userRepositoryController.deleteUser));
    router.post('/user/save', safeCall(this.userRepositoryController.save));

    return router;
  }
}