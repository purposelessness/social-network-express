import express from 'express';
import * as v from 'valibot';

import {ClientError, ServerError} from '~src/types/errors';

type MyFunc<T> = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<T>;

export function safeCall<T>(func: MyFunc<T>) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) =>
      func(req, res, next).catch((e) => {
        if (e instanceof v.ValiError) {
          e = new ClientError(e.message);
        } else if (!(e instanceof ClientError) && !(e instanceof ServerError)) {
          if (e instanceof Error) {
            let oe = e;
            e = new ServerError(e.message);
            e.stack = oe.stack;
          } else {
            e = new ServerError('Internal error');
          }
        }
        next(e);
      });
}
