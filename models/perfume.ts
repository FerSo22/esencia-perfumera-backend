import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
import Gender from './gender';
import Brand from './brand';

class Perfume extends Model { };

export class PerfumeImage extends Model { };

Perfume.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ml: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        gender_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize: db,
        modelName: "Perfume",
        tableName: "perfumes",
        timestamps: true,
        underscored: true
    }
);

PerfumeImage.init(
    {
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        perfume_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    },
    {
        sequelize: db,
        modelName: "PerfumeImage",
        tableName: "images",
        timestamps: false,
        underscored: true,
    }
);

Perfume.belongsTo(Gender, { foreignKey: "gender_id", as: "gender" });
Gender.hasMany(Perfume, { foreignKey: "gender_id", as: "perfumes" });

Perfume.belongsTo(Brand, { foreignKey: "brand_id", as: "brand" });
Brand.hasMany(Perfume, { foreignKey: "brand_id", as: "perfumes" });

PerfumeImage.belongsTo(Perfume, { foreignKey: "perfume_id", as: "perfume" });
Perfume.hasMany(PerfumeImage, { foreignKey: "perfume_id", as: "images" });

export default Perfume;