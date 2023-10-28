import {Router} from 'express';

import {safeCall} from '~src/libraries/utilities';
import {AuthProxyController} from './controller';
import {Role, Status} from './entities';

export class AuthProxyRouter {
  constructor(private readonly controller: AuthProxyController) {
  }

  public getRouter() {
    const router = Router();

    router.post('/login', safeCall(this.controller.login));
    router.post('/register', safeCall(this.controller.register));

    router.get('/get-info', safeCall(this.controller.auth), safeCall(this.controller.getSelfInfo));
    router.get('/get-info/:uid(\\d+)', safeCall(this.controller.auth), safeCall(this.controller.getInfo));
    router.put('/update-info', safeCall(this.controller.auth), safeCall(this.controller.updateInfo));

    return router;
  }

  public auth() {
    const router = Router();
    router.use(safeCall(this.controller.auth));
    return router;
  }

  public permit(requiredRole: Role, requiredStatus: Status) {
    const router = Router();
    const permitFunc = this.controller.permit(requiredRole, requiredStatus);
    router.use(safeCall(permitFunc));
    return router;
  };
}
