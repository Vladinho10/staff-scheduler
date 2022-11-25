import { Request } from 'express';
import moment from 'moment/moment';

import { CustomRequest, CustomResponse } from '../middlewares/respond';
import { ScheduleSrv } from '../services';
import { errorMessages } from '../constants';
import { objects } from '../helpers';
import db from '../dal/models';

export class ScheduleCtrl {
    static async getUserSchedules(req: CustomRequest, res: CustomResponse, next) {
        try {
            const rangeStartFromQuery = req.query.rangeStart as string;
            const rangeEndFromQuery = req.query.rangeEnd as string;
            const userId = req.user.id;

            const rangeStartDate = moment(rangeStartFromQuery)
                .format('YYYY-MM-DD');
            const rangeEndDate = moment(rangeEndFromQuery)
                .format('YYYY-MM-DD');

            const rangeStartDateMS = new Date(rangeStartDate).getTime();
            const rangeEndDateMS = new Date(rangeEndDate).getTime();

            if (!(rangeStartDateMS < rangeEndDateMS)) {
                return res.badRequest({
                    errors: [{
                        message: errorMessages.BAD_REQUEST,
                        description: 'Invalid query',
                    }],
                });
            }

            const oneYearDuration = 365 * 24 * 60 * 60 * 1000;
            const startToEndInterval = rangeEndDateMS - rangeStartDateMS;
            if (startToEndInterval >= oneYearDuration) {
                return res.badRequest({
                    errors: [{
                        message: errorMessages.BAD_REQUEST,
                        description: 'start end interval must be less than one year',
                    }],
                });
            }

            const scheduleList = await ScheduleSrv.getUserSchedules(userId, rangeStartDateMS, rangeEndDateMS);
            return scheduleList.length > 0
                ? res.accepted({ data: scheduleList })
                : res.notFound({ errors: [{ message: 'resource not found' }] });
        } catch (err) {
            next(err);
        }
    }

    static async getCoworkerSchedules(req: CustomRequest, res: CustomResponse) {
        const { companyId } = req.user;
        const { coworkerEmail } = req.query;
        const coworker = await db.User.findOne({
            where: {
                email: coworkerEmail,
                companyId,
            },
        });
        if (!coworker) {
            return res.badRequest({
                errors: [{
                    message: errorMessages.BAD_REQUEST,
                    description: 'Coworker not found',
                }],
            });
        }

        const schedules = await ScheduleSrv.getCoworkerSchedules(coworker);

        return schedules.length > 0
            ? res.accepted({ data: schedules })
            : res.notFound({ errors: [{ message: 'resource not found' }] });
    }

    static async getOne(req: Request, res: CustomResponse) {
        const schedule = await ScheduleSrv.readOne({ _id: req.params._id });

        if (!schedule) {
            return res.notFound({
                errors: [{
                    message: errorMessages.NOT_FOUND,
                    description: 'Schedule not found',
                }],
            });
        }

        return schedule
            ? res.accepted({ data: schedule })
            : res.notFound({ errors: [{ message: 'resource not found' }] });
    }

    static async postOne(req: CustomRequest, res: CustomResponse) {
        type bodyType = {
            email: string,
            start: string,
            end: string,
        }
        const body = objects.pick(req.body, ['email', 'start', 'end']) as bodyType;

        const user = await db.User.findOne({
            where: {
                email: body.email,
            },
        });

        if (!user) {
            return res.notFound({
                errors: [{
                    message: errorMessages.NOT_FOUND,
                    description: 'User not found',
                }],
            });
        }

        const start = new Date(body.start);
        const end = new Date(body.end);

        const startDate = moment(start).format('YYYY-MM-DD');
        const endDate = moment(end).format('YYYY-MM-DD');

        if (startDate !== endDate) {
            return res.notFound({
                errors: [{
                    message: errorMessages.BAD_REQUEST,
                    description: 'Start and end days must be same',
                }],
            });
        }

        const data = await ScheduleSrv.createOne(body, user);

        return res.created({
            data,
        });
    }

    static async putOne(req: Request, res: CustomResponse) {
        type scheduleBody = {
            email:string;
            start: string;
            end: string
        }
        const body =  objects.pick(req.body, ['email', 'start', 'end']) as scheduleBody;

        const schedule = await db.Schedule.findOne({ where: { id: req.params._id } });
        if (!schedule) {
            return res.notFound({
                errors: [{
                    message: errorMessages.NOT_FOUND,
                    description: 'Schedule not found',
                }],
            });
        }

        const start = new Date(body.start || schedule.dataValues.start);
        const end = new Date(body.end || schedule.dataValues.end);

        const startDate = moment(start).format('YYYY-MM-DD');
        const endDate = moment(end).format('YYYY-MM-DD');

        if (startDate !== endDate) {
            return res.notFound({
                errors: [{
                    message: errorMessages.BAD_REQUEST,
                    description: 'Start and end days must be same',
                }],
            });
        }
        const user = await db.User.findOne({
            where: {
                email: body.email,
            },
        });

        if (!user) {
            return res.notFound({
                errors: [{
                    message: errorMessages.NOT_FOUND,
                    description: 'User not found',
                }],
            });
        }

        const updatedSchedule = await ScheduleSrv.updateOne(req.params._id, { ...body, start, end }, user.id);

        return updatedSchedule
            ? res.accepted({ data: updatedSchedule })
            : res.notFound({ errors: [{ message: 'resource not found' }] });
    }

    static async removeOne(req: Request, res: CustomResponse) {
        const isDeleted  = await ScheduleSrv.deleteOne(req.params._id);

        return isDeleted ? res.noContent() : res.notFound({ errors: [{ message: 'resource not found' }] });
    }
}
