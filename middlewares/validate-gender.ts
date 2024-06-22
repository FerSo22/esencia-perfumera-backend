import { Request, Response, NextFunction } from "express";
import { Genders } from "../types/gender";

const isGenderKey = (value: any): boolean => {
    return Object.values(Genders).includes(value);
}

const validateGender = (req: Request, res: Response, next: NextFunction) => {
    const gender = req.query.gender?.toString().toUpperCase();

    if(gender !== undefined && !isGenderKey(gender)) {
        return res.status(400).json({
            ok: false,
            msg: "El género especificado no es válido (M: masculino, F: femenino, U: unisex)"
        });
    }

    next();
}

export default validateGender;