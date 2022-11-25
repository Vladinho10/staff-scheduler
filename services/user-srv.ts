
import { crypt, objects } from '../helpers';
import db from '../dal/models';

import { JwtSrv } from './jwt-srv';

export class UserSrv {
    static async readUsersWithSchedules() {
        const users = await db.User.findAll({
            where: { role: 'user' },
            include: [{
                required: true,
                model: db.Schedule, as: 'schedules',
            }],
        });
        const serializeUsers = await users.map(user => {
            const { schedules } = user;
            let timeAmount = 0;

            for (const schedule of schedules) {
                timeAmount += schedule.timeLength;
            }

            return  {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                workHoursAmount: timeAmount,
            };
        });

        return serializeUsers.sort((userA, userB) => userA.workHoursAmount > userB.workHoursAmount);
    }

    static async readOne(query) {
        return  await db.User.findOne({
            where: { id: query._id, role: 'user' },
            attributes: { exclude: ['password'] },
        });
    }

    static async signUp(body) {
        body.password = crypt.encrypt(body.password);

        const company = await db.Company.findOne({ where: {
            name: body.companyName,
        } });

        const user = await db.User.create({ ...body, companyId: company.dataValues.id });

        return {
            user: objects.skip(user.dataValues, ['password']),
            auth: {
                accessToken: JwtSrv.sign({ id: user.id }),
            },
        };
    }

    static async signIn(user) {
        return {
            user,
            auth: {
                accessToken: JwtSrv.sign({ id: user.id }),
            },
        };
    }

    static async updateOne(id, body) {
        return db.User.update(body, { where: { id } });
    }

    static async deleteOne(id) {
        const deletedCount = (await db.User.destroy({
            where: { id },
        }));

        return (deletedCount > 0);
    }
}
