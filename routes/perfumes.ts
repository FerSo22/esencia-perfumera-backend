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

const router = Router();

router.get(
    "/",
    [
        validateGender,
        validateStatus,
    ],
    getPerfumes
);

router.get(
    "/:id",
    getPerfume
);

router.post(
    "/",
    [
        handleFilesUpload("array", "images"),
        parseFormData(PerfumeToParse),
        validateFields(PerfumeSchema)
    ],
    createPerfume
);

router.put(
    "/:id",
    [
        handleFilesUpload("array", "images"),
        parseFormData(PerfumeToParse),
        validateFields(PerfumeSchema)
    ],
    updatePerfume
);

router.put(
    "/status/:id",
    [
        validateFields(PerfumeStatusSchema)
    ],
    updatePerfumeStatus
)

// router.delete(
//     "/:id",
//     deletePerfume
// );

export default router;