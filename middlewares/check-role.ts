import { NextFunction, Response } from "express"
import { ApiKeyRequest } from "../helpers/request-interfaces";

export const checkRole = (allowedRoles: string[]) => {
    return (req: ApiKeyRequest, res: Response, next: NextFunction) => {
        if(!req.userRole || !allowedRoles.includes(req.userRole)) {
            return res.status(403).json({
                ok: false,
                error: "Permisos insuficientes o rol sin privilegios"
            });
        }

        next();
    }
}