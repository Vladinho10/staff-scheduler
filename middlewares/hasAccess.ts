'use strict';
import Express from 'express';

import { errorMessages } from '../constants';

import { CustomRequest, CustomResponse } from './respond';

export const hasAccess = (Model, field: string) => async (req:CustomRequest, res: CustomResponse, next:Express.NextFunction) => {
    const data = await Model.findOne({ where: { [field]: req.user.id, id: req.params._id }, raw: true });
    // const data = await Model.findOne({where: { id: req.params._id, [field]: req.user.id}, raw: true});

    if (!data) {
        return res.notFound({
            errors: [{
                message: errorMessages.NOT_FOUND,
            }],
        });
    }

    next();
};
