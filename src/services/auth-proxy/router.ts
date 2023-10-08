import {Router} from 'express';

import {safeCall} from '~src/libraries/utilities';
import {AuthProxyController} from './controller';

export class AuthProxyRouter {
  constructor(private readonly controller: AuthProxyController) {
  }

  public getRouter() {
    const router = Router();

    router.post('/login', safeCall(this.controller.login));
    router.post('/register', safeCall(this.controller.register));

    return router;
  }

  public getGlobalRouter() {
    const router = Router();
    router.use(safeCall(this.controller.auth));
    return router;
  }
}
