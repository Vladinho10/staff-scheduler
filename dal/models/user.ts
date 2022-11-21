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
            age: {
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
            },
            createdAt: {
                type: DataTypes.BIGINT,
            },
            updatedAt: {
                type: DataTypes.BIGINT,
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

    return User;
}
