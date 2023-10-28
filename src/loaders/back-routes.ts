import express from 'express';
import * as v from 'valibot';

import {ExceptionWithCodeSchema} from '~src/libraries/parsers/errors';
import authProxy from '~services/auth-proxy';
import newsFeedService from '~services/news-feed';
import messageRepository from '~services/message-repository';
import userRepository from '~services/user-repository';
import userToFriendRepository from '~services/user-to-friend-repository';
import userToMessageRepository from '~services/user-to-message-repository';

export default (server: express.Express) => {
  server.use('/api', authProxy.router.getRouter());

  const auth = authProxy.router.auth();
  server.use('/api/user-repository', auth, userRepository.router.getRouter());
  server.use('/api/message-repository', auth, messageRepository.router.getRouter());
  server.use('/api/user-to-friend-repository', auth, userToFriendRepository.router.getRouter());
  server.use('/api/user-to-message-repository', auth, userToMessageRepository.router.getRouter());
  server.use('/api/news-feed', auth, newsFeedService.router.getRouter());

  server.use('/api', errorHandler);
};

function errorHandler(err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) {
  if (v.is(ExceptionWithCodeSchema, err)) {
    console.error(`Error on ${req.originalUrl}: ${err.toString()} (${err.code})`);
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