'use strict';

export default function (sequelize, DataTypes) {
    const User = sequelize.define(
        'User',
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            firstName: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            lastName: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            role: {
                defaultValue: 'user',
                type: DataTypes.ENUM('user', 'admin'),
            },
            createdAt: {
                type: DataTypes.BIGINT,
            },
            updatedAt: {
                type: DataTypes.BIGINT,
            },
            companyId: {
                type: DataTypes.UUID,
                allowNull: true,
                defaultValue: null,
                references: {
                    model: 'company',
                    key: 'id',
                },
            },
        },
        {
            tableName: 'user',
            timestamps: false,
        },
    );

    User.addHook('beforeSave', async model => {
        if (model.isNewRecord) {
            model.createdAt = new Date().getTime();
        }

        model.updatedAt = new Date().getTime();
    });

    User.associate = function (models) {
        User.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    };
    User.associate = function (models) {
        User.hasMany(models.Schedule, { foreignKey: 'userId', as: 'schedules' });
    };

    return User;
}
