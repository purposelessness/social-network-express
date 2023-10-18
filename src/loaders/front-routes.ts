import express from 'express';

import httpErrors from 'http-errors';

export default (server: express.Express) => {
  server.use('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).render('index', {
      title: 'Social network',
    });
  });

  // create NotFoundError
  server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(httpErrors(404));
  });

  // error handler
  server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    let status = 500;
    let errorTitle = 'Internal Error';
    let errorMessage = 'Sorry, something went wrong.';
    let errorStack = null;

    if (httpErrors.isHttpError(err)) {
      status = err.status;
      errorTitle = err.name;
      errorMessage = `${status} ${err.message}`;
      errorStack = err.stack;
    }

    // render the error page
    res.status(status);
    res.render('error', {
      errorTitle: errorTitle,
      errorMessage: errorMessage,
      errorStack: errorStack,
    });
  });
};
