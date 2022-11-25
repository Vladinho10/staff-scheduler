'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('schedule',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          workDate: {
            type: DataTypes.DATEONLY,
          },
          start: {
            type: DataTypes.DATE,
          },
          end: {
            type: DataTypes.DATE,
          },
          timeLength: {
            type: DataTypes.INTEGER,
          },
          createdAt: {
            type: DataTypes.BIGINT,
          },
          updatedAt: {
            type: DataTypes.BIGINT,
          },
          userId: {
            type: DataTypes.UUID,
            onDelete: 'CASCADE',
            defaultValue: DataTypes.UUIDV4,
            references: {
              model: 'user',
              key: 'id',
            },
          },
        },
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('schedule');
  }
};
