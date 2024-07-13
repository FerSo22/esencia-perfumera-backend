import { Sequelize } from 'sequelize';
import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Config from '../config/config';
import dotenv from 'dotenv';

dotenv.config();

const basename = _basename(__filename);
const env = (process.env.NODE_ENV || 'development') as keyof typeof Config;
const config = Config[env];

const db: any = {};

let sequelize: Sequelize;
if (config.url) {
    sequelize = new Sequelize(config.url, config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// const sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config
// );

readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.ts'
        );
    })
    .forEach((file) => {
        const model = require(join(__dirname, file)).default;
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;