// import * as fs from 'fs';
// import { objects } from '../helpers';

import * as express from 'express';

import middlewares from '../middlewares';

import { fileRt } from './file-rt';
import { rootRt } from './root-rt';
import { scheduleRt } from './schedule-rt';
import { userRt } from './user-rt';

const indexRouter = express.Router();
indexRouter.use(middlewares.combine);

indexRouter.use(userRt);
indexRouter.use(rootRt);
indexRouter.use(fileRt);
indexRouter.use(scheduleRt);

// indexRouter.use(errorHandler);

export default indexRouter;
