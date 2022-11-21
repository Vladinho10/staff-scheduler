'use strict';
import Express from 'express';

import { JwtSrv } from '../services';
import { errorMessages } from '../constants';
import { objects } from '../helpers';
import User from '../dal/models';

import { CustomRequest, CustomResponse } from './respond';

export const auth = authType => async (req:CustomRequest, res: CustomResponse, next:Express.NextFunction) => {
    const verifiedData = JwtSrv.verify(req.headers.token);

    if (objects.isEmptyObject(verifiedData)) {
        return res.unauthorized({ errors: [{
            message: errorMessages.UNAUTHORIZED,
        }] });
    }

    const user = await User.findOne({ where: { id: verifiedData.id }, raw: true });

    if (!user && (authType !== 'optional')) {
        return res.unauthorized({ errors: [{
            message: errorMessages.UNAUTHORIZED,
        }] });
    }

    req.user = user || {};

    next();
};
