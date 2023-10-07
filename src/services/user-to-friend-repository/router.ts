import {Router} from 'express';

import {safeCall} from '~src/libraries/utilities';
import {UserToFriendRepositoryController} from './controller';

export class UserToFriendRepositoryRouter {
  constructor(private readonly controller: UserToFriendRepositoryController) {
  }

  public getRouter() {
    const router = Router();

    router.get('/', safeCall(this.controller.getEntries));
    router.get('/:id(\\d+)', safeCall(this.controller.getEntryById));
    router.post('/', safeCall(this.controller.addFriend));
    router.delete('/:id(\\d+)', safeCall(this.controller.deleteFriend));
    router.post('/save', safeCall(this.controller.save));

    return router;
  }
}