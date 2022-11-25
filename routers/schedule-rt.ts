import * as express from 'express';

import { ScheduleCtrl } from '../controllers';
import { auth } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const scheduleRt = express.Router();

scheduleRt.get('/v1/schedules/coworker', auth, ScheduleCtrl.getCoworkerSchedules);
scheduleRt.get('/v1/schedules/:_id', auth, isAdmin, ScheduleCtrl.getOne);
scheduleRt.post('/v1/schedules', auth, isAdmin, ScheduleCtrl.postOne);
scheduleRt.put('/v1/schedules/:_id', auth,  isAdmin, ScheduleCtrl.putOne);
scheduleRt.delete('/v1/schedules/:_id', auth,  isAdmin, ScheduleCtrl.removeOne);
scheduleRt.get('/v1/schedules/', auth, ScheduleCtrl.getUserSchedules);

export { scheduleRt };
