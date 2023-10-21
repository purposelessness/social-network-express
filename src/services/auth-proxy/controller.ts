import express from 'express';

import * as v from 'valibot';

import {AuthProxyService} from './service';
import {LoginRequestSchema, RegisterRequestSchema, Role, Status, UpdateInfoRequestSchema} from './entities';
import serialize from '~src/libraries/parsers/converter';
import {parseInteger} from '~src/libraries/parsers/common';

export class AuthProxyController {
  constructor(private readonly service: AuthProxyService) {
  }

  public login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(LoginRequestSchema, req.body);
    res.status(200).send(serialize(await this.service.login(request)));
  };

  public register = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(RegisterRequestSchema, req.body);
    await this.service.register(request);
    res.status(200).send();
  };

  public auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!(req.originalUrl === '/api/login' || req.originalUrl === '/api/register')) {
      await this.service.auth(req);
    }
    next();
  };

  public updateInfo = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(UpdateInfoRequestSchema, req.body);
    await this.service.updateInfo(request);
    res.status(200).send();
  };

  public getInfo = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const uid = parseInteger('uid', req.params['uid']);
    res.status(200).json(serialize(await this.service.getInfo(uid)));
  };

  public permit(requiredRole: Role, requiredStatus: Status) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await this.service.permit(req.body.authContext.uid, requiredRole, requiredStatus);
      next();
    };
  }
}