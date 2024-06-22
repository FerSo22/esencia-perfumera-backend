import { z } from 'zod';

const BrandSchema = z.object({
    name: z.string()
            .min(1, "El nombre es obligatorio")
            .min(3, "El nombre debe contener al menos 3 caracteres")
});

export default BrandSchema;