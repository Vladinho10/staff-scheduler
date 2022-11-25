'use strict';

import { DataTypes, Sequelize } from 'sequelize';

import { dbOptions }  from '../../configs';

import makeCompanyModel from './company';
import makeScheduleModel from './schedule';
import makeUserModel from './user';

const sequelize = new Sequelize(dbOptions.database, dbOptions.username, dbOptions.password, dbOptions);
const db: {[key: string]: any} = {};

const companyModel = makeCompanyModel(sequelize, DataTypes);
const userModel = makeUserModel(sequelize, DataTypes);
const scheduleModel = makeScheduleModel(sequelize, DataTypes);
db[companyModel.name] = companyModel;
db[userModel.name] = userModel;
db[scheduleModel.name] = scheduleModel;

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }

    if (db[modelName].addScopes) {
        db[modelName].addScopes(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
