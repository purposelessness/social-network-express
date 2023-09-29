import express from "express";

export default (server: express.Express) => {
  server.get('/', (req: express.Request, res: express.Response) => {
    res.render('index');
  });
}
