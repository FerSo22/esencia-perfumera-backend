import { QueryInterface } from 'sequelize';
import { Sequelize } from 'sequelize';
import Brand from '../models/brand';

export async function up(queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> {
    // INSERTAR TIPOS DE NORMATIVAS INICIALES
    const brands = [
        { name: "Givenchy" },
        { name: "Carolina Herrera" },
        { name: "Chanel" },
        { name: "Dior" },
        { name: "Boss" },
        { name: "Kenzo" },
        { name: "Giorgio Armani" },
        { name: "Pacco Rabanne" },
    ];

    for (const brand of brands) {
        await Brand.findOrCreate({
            where: { name: brand.name },
            defaults: { name: brand.name }
        });
    }
}

export async function down(queryInterface: QueryInterface, sequelize: Sequelize): Promise<void> {
    await queryInterface.bulkDelete('brand', {});
}