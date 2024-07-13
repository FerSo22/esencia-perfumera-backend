import { Router } from 'express';
import validateGender from '../middlewares/validate-gender';
import validateStatus from '../middlewares/validate-status';
import {
    createPerfume,
    deletePerfume,
    getPerfume,
    getPerfumes,
    updatePerfume,
    updatePerfumeStatus
} from '../controllers/perfumes';
import { handleFilesUpload } from '../middlewares/files-handler';
import validateFields from '../middlewares/validate-fields';
import { PerfumeSchema, PerfumeStatusSchema } from '../validations/perfume';
import { parseFormData } from '../middlewares/parse-formdata';
import { PerfumeToParse } from '../helpers/types-to-parse';
import { validateApiKey } from '../middlewares/validate-api-key';
import { checkRole } from '../middlewares/check-role';

const router = Router();

router.get(
    "/",
    [
        validateApiKey,
        checkRole([ "ADMIN", "GUEST" ]),
        validateGender,
        validateStatus,
    ],
    getPerfumes
);

router.get(
    "/:id",
    [
        validateApiKey,
        checkRole([ "ADMIN", "GUEST" ]),
    ],
    getPerfume
);

router.post(
    "/",
    [
        validateApiKey,
        checkRole([ "ADMIN" ]),
        handleFilesUpload("array", "images"),
        parseFormData(PerfumeToParse),
        validateFields(PerfumeSchema)
    ],
    createPerfume
);

router.put(
    "/:id",
    [
        validateApiKey,
        checkRole([ "ADMIN" ]),
        handleFilesUpload("array", "images"),
        parseFormData(PerfumeToParse),
        validateFields(PerfumeSchema)
    ],
    updatePerfume
);

router.put(
    "/status/:id",
    [
        validateApiKey,
        checkRole([ "ADMIN" ]),
        validateFields(PerfumeStatusSchema)
    ],
    updatePerfumeStatus
)

// router.delete(
//     "/:id",
//     deletePerfume
// );

export default router;