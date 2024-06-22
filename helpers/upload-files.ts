import { v2 as cloudinary } from 'cloudinary';

interface UploadedFile {
    file_name: string | undefined,
    size: number  | undefined,
    url: string  | undefined
};

export const uploadFiles = async (files: Express.Multer.File[], folderPath: string): Promise<UploadedFile[]> => {
    const uploadPromises = files.map(image => {
        return new Promise<UploadedFile>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: folderPath },
                (error, result) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve({
                            file_name: result?.secure_url.split("/").pop(),
                            size: result?.bytes,
                            url: result?.secure_url
                        });
                    }
                }
            );
            uploadStream.end(image.buffer);
        });
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    return uploadedFiles;

    // const uploadedImages: any[] = [];
    // for (const image of images) {
    //     await new Promise((resolve, reject) => {
    //         const uploadStream = cloudinary.uploader.upload_stream(
    //             { folder: fullFolderPath },
    //             (error, result) => {
    //                 if (error) {
    //                     console.error(error);
    //                     reject(error);
    //                 } else {

    //                     uploadedImages.push({
    //                         fileName: result?.secure_url.split("/").pop(),
    //                         fileSize: result?.bytes,
    //                         url: result?.secure_url
    //                     });

    //                     resolve(result);
    //                 }
    //             }
    //         );
    //         uploadStream.end(image.buffer);
    //     });
    // }
}