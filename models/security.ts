import { DataTypes, Model, Optional } from "sequelize";
import db from '../db/connection';

interface ApiKeyAttributes {
    id: number;
    role_id: number;
    key: string;
}

class ApiKey extends Model<ApiKeyAttributes> implements ApiKeyAttributes{
    public id!: number;
    public role_id!: number;
    public key!: string;
};

interface RoleAttributes {
    id: number;
    name: string;
}

export class Role extends Model<RoleAttributes> implements RoleAttributes {
    public id!: number;
    public name!: string;
};

ApiKey.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        key: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize: db,
        modelName: "ApiKey",
        tableName: "api_key",
        schema: "security",
        timestamps: true,
        underscored: true
    }
);

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    },
    {
        sequelize: db,
        modelName: "Role",
        tableName: "role",
        schema: "security",
        timestamps: false,
        underscored: true
    }
);

ApiKey.belongsTo(Role, { foreignKey: "role_id", as: "role" });

export default ApiKey