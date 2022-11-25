import http from 'http';

import { Sequelize } from 'sequelize';
import { Server } from 'socket.io';
import express from 'express';
import log4js from 'log4js';

import { CustomError } from './services';
import { dbOptions, files, port } from './configs';
import routers from './routers';

const logger = log4js.getLogger('ENTRY.index');
const app = express();
const server = http.createServer(app);

globalThis.io = new Server(server);

globalThis.CustomError = CustomError;

const sequelize = new Sequelize(dbOptions.database, dbOptions.username, dbOptions.password, dbOptions);
(async () => await sequelize.authenticate())()
    .catch(err => logger.error('Hey, unable to connect to the database', { err }));

// you can specify a path `${origin}/yourPath` or by default it's `${origin}`
app.use(express.static(files));
// app.use(auth);
app.use('/', routers);
app.set('view engine', 'ejs'); // by default ejs files in root's 'views' directory

server.listen(port, () => logger.info(`app listen ${port} port`));
