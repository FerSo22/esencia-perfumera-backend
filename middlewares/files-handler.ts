import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const handleFilesUpload = (uploadType: "single" | "array", fieldName: string) => {
    switch(uploadType) {
        case "single":
            return upload.single(fieldName);
        case "array":
            return upload.array(fieldName);
        default:
            throw new Error("El parámetro del tipo de subida no es válido");
    }
}

export default upload;