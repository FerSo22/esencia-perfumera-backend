import { QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize';
import Gender from '../models/gender';

export async function up(queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> {
    // INSERTAR TIPOS DE NORMATIVAS INICIALES
    const genders = [
        { name: "Masculino", code: "M" },
        { name: "Femenino", code: "F" },
        { name: "Unisex", code: "U" },
    ];

    for (const gender of genders) {
        await Gender.findOrCreate({
            where: { name: gender.name, code: gender.code },
            defaults: { name: gender.name, code: gender.code }
        });
    }
}

export async function down(queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> {
    await queryInterface.bulkDelete('gender', {});
}