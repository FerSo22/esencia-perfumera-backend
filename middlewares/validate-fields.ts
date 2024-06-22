import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

const validateFields = (schema: ZodSchema) => {

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if(error instanceof ZodError) {
                console.log(error.errors)
                return res.status(400).json({
                    ok: false,
                    msg: "Se detectaron errores en el envío de la petición, comunicarse con el administrador"
                });
            }

            next(error);
        }
    }
}

export default validateFields;