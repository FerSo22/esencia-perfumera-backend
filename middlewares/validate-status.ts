import { Request, Response, NextFunction } from "express";

const isValidStatus = (value: any): boolean => {
    return value === "true" || value === "false" || value === "";
}

const validateStatus = (req: Request, res: Response, next: NextFunction) => {
    const status = req.query.active;

    if(status !== undefined && !isValidStatus(status)) {
        return res.status(400).json({
            ok: false,
            msg: "El parámetro 'active' solo permite los valores 'true' o 'false'"
        });
    }

    if(status === "") req.query.active = "true";

    next();
}

export default validateStatus;