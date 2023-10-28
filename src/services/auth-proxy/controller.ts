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
    const token = await this.service.login(request);
    res.status(200).cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    }).send();
  };

  public register = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(RegisterRequestSchema, req.body);
    await this.service.register(request);
    res.status(200).send();
  };

  public auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await this.service.auth(req);
    next();
  };

  public updateInfo = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const request = v.parse(UpdateInfoRequestSchema, req.body);
    await this.service.updateInfo(request);
    res.status(200).send();
  };

  public getSelfInfo = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json(serialize(await this.service.getSelfInfo(req)));
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