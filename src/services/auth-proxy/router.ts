import {Router} from 'express';

import {safeCall} from '~src/libraries/utilities';
import {AuthProxyController} from './controller';
import {Role} from '~services/auth-proxy/entities';

export class AuthProxyRouter {
  constructor(private readonly controller: AuthProxyController) {
  }

  public getRouter() {
    const router = Router();

    router.post('/login', safeCall(this.controller.login));
    router.post('/register', safeCall(this.controller.register));

    return router;
  }

  public auth() {
    const router = Router();
    router.use(safeCall(this.controller.auth));
    return router;
  }

  public permit(requiredRole: Role) {
    const router = Router();
    const permitFunc = this.controller.permit(requiredRole);
    router.use(safeCall(permitFunc));
    return router;
  };
}
