import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface DbConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
    url?: string;
}

interface Config {
    development: DbConfig;
    test: DbConfig;
    production: DbConfig;
}

const config: Config = {
    development: {
        username: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_NAME as string,
        host: process.env.DB_HOST as string,
        dialect: "postgres",
        url: process.env.DB_URL
    },
    test: {
        username: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        database: `${process.env.DB_NAME}_test` as string,
        host: process.env.DB_HOST as string,
        dialect: "postgres",
        url: process.env.DB_URL
    },
    production: {
        username: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_NAME as string,
        host: process.env.DB_HOST as string,
        dialect: "postgres",
        url: process.env.DB_URL
    }
};

export default config;
module.exports = config;
