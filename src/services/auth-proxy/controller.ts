import express from 'express';

import * as v from 'valibot';

import {AuthProxyService} from './service';
import {LoginRequestScheme, RegisterRequestScheme} from './entities';
import serialize from '~src/libraries/parsers/converter';

export class AuthProxyController {
  constructor(private readonly service: AuthProxyService) {
  }

  public login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(LoginRequestScheme, req.body);
    res.status(200).send(serialize(await this.service.login(request)));
  };

  public register = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(RegisterRequestScheme, req.body);
    await this.service.register(request);
    res.status(200).send();
  };

  public auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!(req.originalUrl === '/api/login' || req.originalUrl === '/api/register')) {
      await this.service.auth(req);
    }
    next();
  };
}