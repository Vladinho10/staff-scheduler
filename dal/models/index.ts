'use strict';

import { DataTypes, Sequelize } from 'sequelize';

import { dbOptions }  from '../../configs';

import makeUserModel from './user';

const sequelize = new Sequelize(dbOptions.database, dbOptions.username, dbOptions.password, dbOptions);
const db: {[key: string]: any} = {};

const userModel = makeUserModel(sequelize, DataTypes);
db[userModel.name] = userModel;

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
