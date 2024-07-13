import { DataTypes, Model } from "sequelize";
import db from "../db/connection";
// import Perfume from "./perfume";

class Brand extends Model { }

Brand.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    },
    {
        sequelize: db,
        modelName: "Brand",
        tableName: "brand",
        schema: "esencia_perfumera",
        timestamps: true,
        underscored: true
    }
);

export default Brand;
// export const Brand = db.define("brand", {
    // name: {
    //     type: DataTypes.STRING
    // }
// },
// {
//     timestamps: false
// });