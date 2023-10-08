import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

import express from 'express';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import {__src_dir} from '~src/config';
import backendRouter from '~src/loaders/back-routes';
import frontRouter from '~src/loaders/front-routes';

const server = express();

// compress all responses with gzip
server.use(compression());
// print request logs
server.use(morgan('dev'));
// process body parameters
server.use(express.json());
// process url encoded parameters
server.use(express.urlencoded({extended: false}));
// process cookies
server.use(cookieParser());
// process public files
server.use(express.static(path.join(__src_dir, 'public')));

backendRouter(server);
frontRouter(server);

const privateKey = fs.readFileSync(path.join(__src_dir, 'sslcert/purposeless.social-network.key'), 'utf-8');
const certificate = fs.readFileSync(path.join(__src_dir, 'sslcert/purposeless.social-network.crt'), 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
};

const httpServer = http.createServer(server);
const httpsServer = https.createServer(credentials, server);

httpServer.listen(8080, () => {
  console.log('Server started at http://localhost:8080/');
});
httpsServer.listen(8443, () => {
  console.log('Server started at https://localhost:8443/');
});