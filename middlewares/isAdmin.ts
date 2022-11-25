'use strict';
import Express from 'express';

import { errorMessages } from '../constants';

import { CustomRequest, CustomResponse } from './respond';

export const isAdmin = async (req:CustomRequest, res: CustomResponse, next:Express.NextFunction) => {
    if (req.user.role !== 'admin') {
        return res.forbidden({
            errors: [{
                message: errorMessages.FORBIDDEN,
            }],
        });
    }

    next();
};
