import { Router } from 'express';
import {
    createBrand,
    getBrands,
} from '../controllers/brands';
import { validateApiKey } from '../middlewares/validate-api-key';
import { checkRole } from '../middlewares/check-role';

const router = Router();

router.get(
    "/",
    [
        validateApiKey,
        checkRole([ "ADMIN", "GUEST" ]),
    ],
    getBrands
);

router.post(
    "/",
    [
        validateApiKey,
        checkRole([ "ADMIN" ]),
    ],
    createBrand
)

export default router;