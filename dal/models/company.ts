'use strict';

export default function (sequelize, DataTypes) {
    const Company = sequelize.define(
        'Company',
        {
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
            },
            updatedAt: {
                type: DataTypes.BIGINT,
            },
        },
        {
            tableName: 'company',
            timestamps: false,
        },
    );

    Company.addHook('beforeSave', async model => {
        if (model.isNewRecord) {
            model.createdAt = new Date().getTime();
        }

        model.updatedAt = new Date().getTime();
    });

    Company.associate = function (models) {
        Company.hasMany(models.User, { foreignKey: 'companyId', as: 'employes' });
    };

    return Company;
}
