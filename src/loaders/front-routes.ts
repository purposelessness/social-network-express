import express from 'express';

import createError from 'http-errors';

export default (server: express.Express) => {

  // create NotFoundError
  server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(createError(404));
  });

  // error handler
  server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // set locals, only providing error in development
    res.locals['message'] = err.message;
    res.locals['error'] = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

};
