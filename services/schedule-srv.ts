import { Op } from 'sequelize';
import moment from 'moment';

import db from '../dal/models';

export class ScheduleSrv {
    static async getUserSchedules(userId, rangeStart, rangeEnd) {
        const userSchedules = await db.Schedule.findAll({
            where: {
                userId,
                workDate: {
                    [Op.gte]: rangeStart,
                    [Op.lte]: rangeEnd,
                },
            },
        });
        return await userSchedules;
    }

    static async getCoworkerSchedules(coworker) {
        return await db.Schedule.findAll({ where: { userId: coworker.id } });
    }

    static async readOne(query) {
        return db.Schedule.findOne({ where: { id: query._id } });
    }

    static async createOne(body, user) {
        const start = new Date(body.start);
        const end = new Date(body.end);
        const milliseconds  = end.getTime() - start.getTime();
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const timeLength = Math.floor(minutes / 60);
        const workDate = moment(start).format('YYYY-MM-DD');
        const scheduleBody = {
            userId: user.dataValues.id,
            start,
            end,
            timeLength,
            workDate,
        };

        return  await db.Schedule.create(scheduleBody);
    }

    static async updateOne(id, body, scheduleOwner) {
        const start = new Date(body.start);
        const end = new Date(body.end);
        const milliseconds  = end.getTime() - start.getTime();
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const timeLength = Math.floor(minutes / 60);
        const workDate = moment(start).format('YYYY-MM-DD');

        const scheduleBody = {
            userId: scheduleOwner,
            start,
            end,
            timeLength,
            workDate,
        };
        return db.Schedule.update(scheduleBody, { where: { id } });
    }

    static async deleteOne(id) {
        const deletedCount = (await db.Schedule.destroy({
            where: { id },
        }));

        return (deletedCount > 0);
    }
}
