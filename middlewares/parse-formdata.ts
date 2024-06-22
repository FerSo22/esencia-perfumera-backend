import { Request, Response, NextFunction } from 'express';

// const transformData = (body: any) => {
//     let {
//         brand_id,
//         price,
//         stock,
//         ml,
//         gender_id
//     } = body;

//     brand_id = parseInt(brand_id);
//     price = parseFloat(price);
//     stock = parseInt(stock);
//     ml = parseInt(ml);
//     gender_id = parseInt(gender_id);

//     return {
//         ...body,
//         brand_id,
//         price,
//         stock,
//         ml,
//         gender_id
//     };
// }

export const parseFormData = (schema: Record<string, string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        for (const key in schema) {
            if (req.body[key]) {
                switch (schema[key]) {
                    case "number":
                        req.body[key] = parseFloat(req.body[key]);
                        break;
                    case "integer":
                        req.body[key] = parseInt(req.body[key], 10);
                        break;
                    case "boolean":
                        req.body[key] = req.body[key] === "true";
                        break;
                }
            }
        }
        next();

        // req.body = transformData(req.body);
        // const result = schema.safeParse(req.body);

        // if (!result.success) {
        //     console.log(result.error.errors);
        //     return res.status(400).json({
        //         ok: false,
        //         msg: "Se detectaron errores en el envío de la petición, comunicarse con el administrador"
        //     });
        // }

        // next();
    }
}