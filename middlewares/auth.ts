'use strict';
import Express from 'express';

import { JwtSrv } from '../services';
import { errorMessages } from '../constants';
import { objects } from '../helpers';
import db from '../dal/models';

import { CustomRequest, CustomResponse } from './respond';

const exclude = [
    'POST:/v1/users/sign-up',
    'POST:/v1/users/sign-in',
];

export const auth = async (req:CustomRequest, res: CustomResponse, next:Express.NextFunction) => {
    try {
        const { originalUrl, method } = req;

        if (method === 'OPTIONS' || exclude.includes(`${method}:${originalUrl}`)) {
            next();
            return;
        }

        const { token } = req.headers;

        const propertyName = 'id';
        const verifiedData =  await JwtSrv.verify(token) ;

        if (objects.isEmptyObject(verifiedData) || typeof verifiedData === 'undefined') {
            return res.unauthorized({ errors: [{
                message: errorMessages.UNAUTHORIZED,
            }] });
        }
        const user = await db.User.findOne({ where: { id: verifiedData[propertyName] }, raw: true });

        if (!user) {
            return res.unauthorized({ errors: [{
                message: errorMessages.UNAUTHORIZED,
            }] });
        }

        req.user = user || {};
        next();
    } catch (err) {
        console.log(err);
    }
};
