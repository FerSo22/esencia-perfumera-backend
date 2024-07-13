import { NextFunction, Response } from "express"
import bcrypt from "bcrypt";
import ApiKey, { Role } from "../models/security";
import { ApiKeyRequest } from "../helpers/request-interfaces";

// const saltRounds = 10;

export const validateApiKey = async (req: ApiKeyRequest, res: Response, next: NextFunction) => {
    const apiKeyHeader = req.headers["authorization"];
    if(!apiKeyHeader) {
        return res.status(401).json({
            ok: false,
            error: "No se encontró la API KEY en la solicitud"
        });
    }

    const apiKey = apiKeyHeader.split(" ")[1]; // Formato: "Authorization: Bearer <api_key>"
    if(!apiKey) {
        return res.status(401).json({
            ok: false,
            error: "Formato de API KEY no válido"
        });
    }

    try {
        const dbApiKeys = await ApiKey.findAll();
        let isMatch = false;
        let matchedApiKey;

        for(const dbApiKey of dbApiKeys) {
            isMatch = await bcrypt.compare(apiKey, dbApiKey.key);

            if(isMatch) {
                matchedApiKey = dbApiKey;
                break;
            }
        }

        if(!isMatch || !matchedApiKey) {
            return res.status(401).json({
                ok: false,
                error: "API KEY no válida"
            });
        }

        const role = await Role.findByPk(matchedApiKey.role_id);
        if(!role) {
            return res.status(401).json({
                ok: false,
                error: "La API KEY proporcionada no cuenta con privilegios"
            });
        }

        req.userRole = role.name;

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor... Revisar logs"
        });
    }
}