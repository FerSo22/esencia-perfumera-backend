import { Router } from 'express';
import { 
    getGenders,
} from '../controllers/genders';

const router = Router();

router.get(
    "/",
    getGenders
);

export default router;