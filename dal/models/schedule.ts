'use strict';
export default function (sequelize, DataTypes) {
    const Schedule = sequelize.define(
        'Schedule',
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
                defaultValue: DataTypes.UUIDV4,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
        },
        {
            tableName: 'schedule',
            timestamps: false,
        },
    );

    Schedule.addHook('beforeSave', async model => {
        if (model.isNewRecord) {
            model.createdAt = new Date().getTime();
        }

        model.updatedAt = new Date().getTime();
    });

    Schedule.associate = function (models) {
        Schedule.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Schedule;
}
