import {Router} from 'express';

import {safeCall} from '~src/libraries/utilities';
import {ChatRepositoryController} from './controller';

export class ChatRepositoryRouter {
  constructor(private readonly controller: ChatRepositoryController) {
  }

  public getRouter() {
    const router = Router();

    router.get('/', safeCall(this.controller.getChats));
    router.get('/user/:uid(\\d+)', safeCall(this.controller.getUserChats));
    router.get('/exists/:id(\\d+)', safeCall(this.controller.doesChatExist));
    router.post('/', safeCall(this.controller.addChat));
    router.delete('/:id(\\d+)', safeCall(this.controller.deleteChat));
    router.post('/:id(\\d+)', safeCall(this.controller.addMessageToChat));
    router.post('/save', safeCall(this.controller.save));

    return router;
  }
}