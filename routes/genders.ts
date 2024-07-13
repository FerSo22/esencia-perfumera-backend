import { Router } from 'express';
import {
    getGenders,
} from '../controllers/genders';
import { validateApiKey } from '../middlewares/validate-api-key';
import { checkRole } from '../middlewares/check-role';

const router = Router();

router.get(
    "/",
    [
        validateApiKey,
        checkRole([ "ADMIN", "GUEST" ]),
    ],
    getGenders
);

export default router;