import { Request, Response } from "express";
import Gender from "../models/gender";

export const getGenders = async (req: Request, res: Response) => {
    try {
        const genders = await Gender.findAll();
    
        res.json({
            ok: true,
            genders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor... Revisar logs"
        });
    }
}