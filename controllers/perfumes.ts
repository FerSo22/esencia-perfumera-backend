import { Request, Response } from "express";
import { FindOptions, Op, QueryTypes } from 'sequelize';

import Perfume, { PerfumeImage } from "../models/perfume";
import Brand from "../models/brand";
import Gender from "../models/gender";

// import { Genders, GendersKeys } from "../types/gender";
import { getFolderName } from "../helpers/get-folder-name";
import { uploadFiles } from "../helpers/upload-files";
import { v2 as cloudinary } from 'cloudinary';
import db from "../db/connection";

export const getPerfumes = async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || undefined;
    const from = Number(req.query.from) || undefined;
    const gender = req.query.gender?.toString().toUpperCase() || undefined;
    const status = req.query.active || undefined;

    try {
        const perfumes = await db.query(`
                SELECT * FROM get_perfumes_with_default_images(
                    :gender_param,
                    :status_param,
                    :limit_param,
                    :offset_param
                )
            `,
            {
                replacements: {
                    gender_param: gender || null,
                    status_param: status || null,
                    limit_param: limit || null,
                    offset_param: from || null
                },
                type: QueryTypes.SELECT
            }
        );

        res.json({
            ok: true,
            count: perfumes.length,
            limit,
            from,
            status,
            gender,
            perfumes
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor... Revisar logs"
        });
    }

    // try {
    //     const findOptions: FindOptions = {
    //         attributes: [
    //             "id",
    //             "name",
    //             "description",
    //             "price",
    //             "stock",
    //             "ml",
    //             "status"
    //         ],
    //         include: [
    //             { model: Brand, attributes: ["id", "name"], as: "brand" },
    //             { model: Gender, attributes: ["id", "name", "code"], as: "gender" },
    //             { model: PerfumeImage, attributes: ["file_name", "url", "size"], as: "images" },
    //         ],
    //         // where: { status },
    //         limit,
    //         offset: from,
    //         order: [["id", "ASC"]]
    //     };

    //     if(gender) {
    //         findOptions.where = {
    //             ...findOptions.where,
    //             gender_id: Genders[gender.toUpperCase() as GendersKeys] + 1
    //         };
    //     }

    //     if(status) {
    //         findOptions.where = {
    //             ...findOptions.where,
    //             status
    //         }
    //     }

    //     const {rows: perfumes, count} = await Perfume.findAndCountAll({
    //         ...findOptions,
    //         // Se utiliza el distinct para que haga el conteo correcto de los perfumes, ya que sino también cuenta cada registro de la tabla 'images', del include que se está haciendo en el findOptions
    //         distinct: true
    //     });

    //     res.json({
    //         ok: true,
    //         count,
    //         limit,
    //         from,
    //         status,
    //         gender,
    //         perfumes
    //     });
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({
    //         ok: false,
    //         msg: "Error en el servidor... Revisar logs"
    //     });
    // }
}

export const getPerfume = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const findOptions: FindOptions = {
            attributes: ["name", "description", "price", "stock", "ml", "brand_id", "gender_id"],
            include: [
                { model: Brand, attributes: ["id", "name"], as: "brand" },
                { model: Gender, attributes: ["id", "name", "code"], as: "gender" },
                { model: PerfumeImage, attributes: ["file_name", "url", "size"], as: "images" }
            ],
            // include: [
            //     { model: Brand, attributes: ["id"], as: "brand" },
            //     { model: Gender, attributes: ["id"], as: "gender" }
            // ]
        };

        const perfume = await Perfume.findByPk(id, findOptions);

        if(!perfume) {
            return res.status(404).json({
                ok: false,
                msg: "Perfume no encontrado"
            });
        }

        res.json({
            ok: true,
            perfume
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor... Revisar logs"
        });
    }
}

export const createPerfume = async (req: Request, res: Response) => {
    const {
        name,
        brand_id,
        description,
        price,
        stock,
        ml,
        gender_id
    } = req.body;

    const images = req.files as Express.Multer.File[];

    const folderName = `${brand_id}-${getFolderName(name)}`;
    const fullFolderPath = `esencia_perfumera/perfumes/${folderName}`;

    try {
        const findOptions: FindOptions = {
            where: {
                name: { [Op.iLike]: name.trim() },
                brand_id
            }
        }

        const existingPerfume = await Perfume.findOne(findOptions);

        if(existingPerfume) {
            return res.status(400).json({
                ok: false,
                msg: "El perfume ya se encuentra registrado"
            });
        }

        const dbPerfume = await Perfume.create({
            name,
            brand_id,
            description,
            price,
            stock,
            ml,
            gender_id
        });

        // await dbPerfume.save();

        const idNewPerfume = dbPerfume.dataValues.id;
        let dbPerfumeImagesUploaded: PerfumeImage[] = [];

        if(images && images.length > 0) {
            const uploadedImages = await uploadFiles(images, fullFolderPath);

            const imageUploadPromises = uploadedImages.map(({ file_name, url, size }) => {
                return PerfumeImage.create({
                    file_name,
                    url,
                    size,
                    perfume_id: idNewPerfume
                });
            });

            dbPerfumeImagesUploaded = await Promise.all(imageUploadPromises);

            // for(const image of uploadedImages) {
            //     const dbPerfumeImages = PerfumeImage.build({
            //         ...image,
            //         perfume_id: idNewPerfume
            //     });

            //     await dbPerfumeImages.save();

            //     dbPerfumesUploaded.push(dbPerfumeImages);
            // }
        }

        // console.log(dbPerfume);
        // console.log(dbPerfumeImagesUploaded);
        res.json({
            ok: true,
            msg: "Perfume registrado con éxito",
            perfume: dbPerfume,
            images: dbPerfumeImagesUploaded
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor... Revisar logs"
        });
    }
}

export const updatePerfume = async (req: Request, res: Response) => {
    const { id } = req.params;

    const {
        name,
        brand_id,
        description,
        price,
        stock,
        ml,
        gender_id
    } = req.body;

    const images = req.files as Express.Multer.File[];

    const folderName = `${brand_id}-${getFolderName(name)}`;
    const fullFolderPath = `esencia_perfumera/perfumes/${folderName}`;

    try {
        const dbPerfume = await Perfume.findByPk(id);

        if(!dbPerfume) {
            return res.status(404).json({
                ok: false,
                msg: "Perfume no encontrado"
            });
        }

        const findOptions: FindOptions = {
            where: {
                name: { [Op.iLike]: name.trim() },
                brand_id,
                id: { [Op.ne]: id }
            }
        }

        const existingPerfume = await Perfume.findOne(findOptions);

        if(existingPerfume) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un perfume registrado con el mismo nombre y marca"
            });
        }

        await dbPerfume.update({
            name,
            brand_id,
            description,
            price,
            stock,
            ml,
            gender_id
        });

        const dbPerfumeImages = await PerfumeImage.findAll({ where: { perfume_id: id } });

        const newImageNames = images.map(image => image.originalname);

        const imagesToDelete: any = dbPerfumeImages.filter((dbImage: any) => !newImageNames.includes(dbImage.file_name));

        for(const image of imagesToDelete) {
            const publicId = `${fullFolderPath}/${image.file_name}`.replace(/\.[^/.]+$/, "");
            await cloudinary.uploader.destroy(publicId);

            await PerfumeImage.destroy({ where: { file_name: image.file_name, perfume_id: id } });
        }

        const imagesToUpload = images.filter(image => !dbPerfumeImages.some((dbImage: any) => dbImage.file_name === image.originalname));

        // let dbPerfumeImagesUploaded: PerfumeImage[] = [];

        if(imagesToUpload.length > 0) {
            const uploadedImages = await uploadFiles(imagesToUpload, fullFolderPath);

            const imageUploadPromises = uploadedImages.map(({ file_name, url, size }) => {
                return PerfumeImage.create({
                    file_name,
                    url,
                    size,
                    perfume_id: id
                });
            });

            await Promise.all(imageUploadPromises);
            // dbPerfumeImagesUploaded = await Promise.all(imageUploadPromises);
        }

        const dbPerfumeImagesNew = await PerfumeImage.findAll({ where: { perfume_id: id } });

        res.json({
            ok: true,
            msg: "Perfume actualizado con éxito",
            perfume: dbPerfume,
            // images: dbPerfumeImagesUploaded.length === 0 ? dbPerfumeImages : dbPerfumeImagesUploaded
            images: dbPerfumeImagesNew
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor... Revisar logs"
        });
    }
}

export const updatePerfumeStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const perfume = await Perfume.findByPk(id);

        if(!perfume) {
            return res.status(404).json({
                ok: false,
                msg: "Perfume no encontrado"
            });
        }

        await perfume.update({ status });

        res.json({
            ok: true,
            newStatus: status
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor... Revisar logs"
        });
    }
}

export const deletePerfume = (req: Request, res: Response) => {
    const { id } = req.params;

    res.json({
        msg: "deletePerfume",
        id
    });
}