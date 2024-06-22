import { z } from 'zod';

export const PerfumeSchema = z.object({
    name: z.string(
                {
                    required_error: "No se encontró el nombre del perfume",
                    message: "El tipo de dato del nombre no es válido (válido: texto)"
                })
            .min(1, "El nombre es obligatorio")
            .min(5, "El nombre debe contener al menos 5 caracteres"),
    brand_id: z.number(
                {
                    // message: "El tipo de dato del ID de la marca no es válido (válido: número)",
                    message: "El tipo de dato del ID de la marca no es válido (válido: número)",
                    required_error: "No se encontró el ID de la marca"
                })
            .int({ message: "El ID de la marca debe ser un número entero positivo" })
            .positive({ message: "El ID de la marca debe ser un número entero positivo" }),
    description: z.string(
                {
                    message: "El tipo de dato de la descripción no es válido (válido: texto)",
                    required_error: "No se encontró la descripción del perfume"
                })
            .min(1, "La descripción es obligatoria")
            .max(150, "La descripción no debe exceder los 150 caracteres"),
    price: z.number(
                {
                    message: "El tipo de dato del precio no es válido (válido: número)",
                    required_error: "No se encontró el precio del perfume"
                })
            .positive({ message: "El precio debe ser un número positivo" }),
    stock: z.number(
                {
                    message: "El tipo de dato del stock no es válido (válido: número)",
                    required_error: "No se encontró el stock del perfume"
                })
            .int({ message: "El stock debe ser un número entero positivo o cero" })
            .nonnegative({ message: "El stock debe ser un número entero positivo o cero" }),
    ml: z.number(
                {
                    message: "El tipo de dato de la cantidad (ml) no es válido (válido: número)",
                    required_error: "No se encontró la cantidad (ml) del perfume"
                })
            .int({ message: "La cantidad (ml) debe ser un número entero positivo" })
            .positive({ message: "El stock debe ser un número entero positivo" }),
    gender_id: z.number(
                {
                    message: "El tipo de dato del ID del género no es válido (válido: número)",
                    required_error: "No se encontró el ID del género"
                })
            .int({ message: "El ID del género debe ser un número entero positivo" })
            .positive({ message: "El ID del género debe ser un número entero positivo" }),
    status: z.boolean()
            .default(true)
});

export const PerfumeStatusSchema = z.object({
    status: z.boolean(
        {
            message: "El estado debe ser un valor booleano (true o false)",
            required_error: "El estado es obligatorio"
        })
});