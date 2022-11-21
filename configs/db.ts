import { Options } from 'sequelize';

export const dbOptions: Options = {
    logging: console.log,
    dialect: 'mysql',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};
