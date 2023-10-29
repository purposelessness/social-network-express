import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import express from 'express';
import sassMiddleware from 'node-sass-middleware';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import {__front_src_dir, __project_dir, __public_dir} from '~src/config';
import backendRouter from '~src/loaders/back-routes';
import frontRouter from '~src/loaders/front-routes';
import {initIo} from '~src/socket';

const server = express();

// pug
server.set('view engine', 'pug');
server.set('views', path.join(__front_src_dir, 'views'));
// sass-middleware
server.use(sassMiddleware({
  src: __front_src_dir,
  dest: __public_dir,
  debug: false,
  outputStyle: 'compressed',
}));
// process public files
server.use(express.static(__public_dir));

// enable cors
server.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));
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

backendRouter(server);
frontRouter(server);

const privateKey = fs.readFileSync(path.join(__project_dir, 'sslcert/purposeless.social-network.key'), 'utf-8');
const certificate = fs.readFileSync(path.join(__project_dir, 'sslcert/purposeless.social-network.crt'), 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
};

const httpServer = http.createServer(server);
const httpsServer = https.createServer(credentials, server);

initIo(httpServer);

httpServer.listen(8080, () => {
  console.log('Server started at http://localhost:8080/');
});
httpsServer.listen(8443, () => {
  console.log('Server started at https://localhost:8443/');
});