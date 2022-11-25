'use strict';

const uuid = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('company',  {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.BIGINT,
        defaultValue: Date.now(),
      },
      updatedAt: {
        type: DataTypes.BIGINT,
        defaultValue: Date.now(),
      },
    },);

    return queryInterface.bulkInsert('company', [{
      id: uuid.v4(),
      name: 'First Company',
      address: 'Armenia',
    },
      {
        id: uuid.v4(),
        name: 'Second Company',
        address: 'Armenia',
      }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('company');
  }
};
