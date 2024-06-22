import { Request, Response } from "express";
import Brand from "../models/brand";
import { FindOptions, Op } from "sequelize";

export const getBrands = async (req: Request, res: Response) => {
    try {
        const brands = await Brand.findAll();
    
        res.json({
            ok: true,
            brands
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor... Revisar logs"
        });
    }
}

export const createBrand = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const findOptions: FindOptions = {
            where: {
                name: { [Op.iLike]: name.trim() },
            }
        }

        const brand = await Brand.findOne(findOptions);
    
        if(brand) {
            return res.status(400).json({
                ok: false,
                msg: "La marca ya se encuentra registrada"
            });
        }

        const dbBrand = Brand.build({
            name
        })

        await dbBrand.save();

        res.json({
            ok: true,
            msg: "Marca registrada con éxito",
            brand: dbBrand
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor... Revisar logs"
        });
    }
}