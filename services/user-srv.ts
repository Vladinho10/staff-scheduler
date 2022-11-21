import { objects } from '../helpers';
import db from '../dal/models';

import { JwtSrv } from './jwt-srv';

export class UserSrv {
    static async readMany(query, options) {
        return db.User.find(query)
            .limit(+options.limit || 10)
            .skip(+options.offset)
            .sort(options.sort);
    }

    static async readOne(query) {
        const user = await db.User.findOne({ where: { id: query._id } });
        console.log({ user });

        const json = db.User.toJSON();

        console.log({ json });
        return json;
    }

    static async createOne(body) {
        const user = await db.User.create(body);
        return {
            user,
            auth: {
                token: JwtSrv.sign({ id: db.User.id }),
            },
        };
    }

    static async createMany(body) {
        return db.User.insertMany(body);
    }

    static async updateOne(id, body) {
        const newData = await objects.pick(body, ['name', 'age']);

        const user = await db.User.findOne({ where: { id } });

        if (!user) {
            return { message: 'error' };
        }
        for (const key in newData) {
            user[key] = newData[key];
        }
        return db.User.save();
    }

    static async updateMany(body) {
        const newData = objects.pick(body.updatingFields, ['name', 'age', 'gender']);

        const { nModified } = (await db.User.updateMany(
            body.filter, // find criteria
            newData, // changing data
        ));

        return (nModified > 0);
    }

    static async deleteOne(_id) {
        const { deletedCount } = (await db.User.deleteOne({ _id }));

        return (deletedCount > 0);
    }

    static async deleteMany(ids) {
        const { deletedCount } = (await db.User.deleteMany({ _id: { $in: ids } }));

        return (deletedCount > 0);
    }
}
