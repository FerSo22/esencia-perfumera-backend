import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// const dbConnection = new Sequelize(
//     process.env.DB_NAME!,
//     process.env.DB_USER!,
//     process.env.DB_PASSWORD!,
//     {
//         host: "localhost",
//         dialect: "postgres"
//     }
// );

const dbConnection = new Sequelize(process.env.DB_URL!);

export default dbConnection;