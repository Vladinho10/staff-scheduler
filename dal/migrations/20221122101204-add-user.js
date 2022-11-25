'use strict';

const uuid = require('uuid');
const { crypt } = require('../../dist/helpers/crypt');
const { User } = require('../../dist/dal/models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('user', {
            id: {
                allowNull: false, primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4,
            }, email: {
                type: DataTypes.STRING,
            }, firstName: {
                type: DataTypes.STRING,
            }, lastName: {
                type: DataTypes.STRING,
            }, password: {
                type: DataTypes.STRING,
            }, role: {
                type: DataTypes.ENUM('user', 'admin'),
            }, createdAt: {
                type: DataTypes.BIGINT, defaultValue: Date.now(),
            }, updatedAt: {
                type: DataTypes.BIGINT, defaultValue: Date.now(),
            }, companyId: {
                type: DataTypes.UUID, allowNull: true, defaultValue: null, references: {
                    model: 'company', key: 'id',
                },
            },
        });

        return queryInterface.bulkInsert('user', [{
            id: uuid.v4(), email: 'admin@rest.com', firstName: 'AdminFirstName', lastName: 'AdminLastName', password: `${crypt.encrypt('password')}`, role: 'admin',
        }]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user');
    },
};
