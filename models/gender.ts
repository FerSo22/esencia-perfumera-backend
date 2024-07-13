import { DataTypes, Model } from "sequelize";
import db from "../db/connection";
// import Perfume from "./perfume";

class Gender extends Model { }

Gender.init(
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
        },
        code: {
            type: DataTypes.CHAR(1),
            allowNull: false
        }
    },
    {
        sequelize: db,
        modelName: "Gender",
        tableName: "gender",
        schema: "esencia_perfumera",
        timestamps: false,
        underscored: true
    }
);

export default Gender;
// export const Gender = db.define("gender", {
    // name: {
    //     type: DataTypes.STRING
    // },
    // code: {
    //     type: DataTypes.STRING
    // }
// },
// {
//     timestamps: false
// });