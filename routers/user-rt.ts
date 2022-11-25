import * as express from 'express';

import { UserCtrl } from '../controllers';
import { auth } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const userRt = express.Router();

userRt.get('/v1/users/with-schedules', auth, isAdmin, UserCtrl.getManyWhitSchedules);
userRt.get('/v1/users/:_id', auth, UserCtrl.getOne);
userRt.put('/v1/users/:_id', auth, isAdmin, UserCtrl.putOne);
userRt.delete('/v1/users/:_id', auth, isAdmin, UserCtrl.removeOne);

userRt.post('/v1/users', UserCtrl.signUp);
userRt.post('/v1/users/sign-in', UserCtrl.signIn);

export { userRt };
