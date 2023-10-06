import express from 'express';
import * as v from 'valibot';

import {ExceptionWithCodeSchema} from '~src/parsers/errors';
import userRepository from '~services/user-repository';

function errorHandler(err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) {
  if (v.is(ExceptionWithCodeSchema, err)) {
    console.error(`Error on ${req.originalUrl}: ${err.code} - ${err.message}`);
    const json = {
      code: err.code,
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
    return res.status(err.code).json(json);
  } else {
    console.error(`Error on ${req.originalUrl}: ${err})`);
    res.status(500).json(err);
  }
}

export default (server: express.Express) => {
  server.use('/api/user-repository', userRepository.router.getRouter());

  server.use('/api', errorHandler);
};