import express, { Application } from 'express';
import cors from 'cors';
import perfumeRoutes from '../routes/perfumes';
import genderRoutes from '../routes/genders';
import brandRoutes from '../routes/brands';
import db from '../db/connection';
import { v2 as cloudinary } from 'cloudinary';

class Server {
    private app: Application;
    private port: string;
    private apiPaths = {
        perfumes: '/api/perfumes',
        genders: '/api/genders',
        brands: '/api/brands'
    };

    constructor() {
        this.app = express();
        this.port = process.env.PORT || "8000";
        // Métodos iniciales
        this.setCloudinaryConfig();
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    setCloudinaryConfig() {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        });
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log("Conexión establecida con la base de datos");

            await db.sync();
            console.log("Bases de datos creadas");
        } catch (error) {
            throw new Error(`Ocurrió un error al conectar con la base de datos: ${error}`);
        }
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        })
    }

    middlewares() {
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");
        // console.log(allowedOrigins);
        // CORS
        this.app.use(cors({
            origin: (origin, callback) => {
                if(!origin) return callback(null, true);

                // ACTIVAR LUEGO DE SUBIR, PARA EVITAR SOLICITUDES DESDE ENCABEZADOS SIN ORIGEN
                // EN DESARROLLO DESACTIVAR PARA TESTEAR CON POSTMAN
                // if (!origin) {
                //     callback(new Error("Acceso no permitido: Falta el encabezado de origen"));
                // }

                if(origin && allowedOrigins.indexOf(origin) !== -1) {
                    callback(null, true);
                } else {
                    callback(new Error(`Acceso no permitido: Origen desconocido: ${origin}`));
                }
            },
            methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Lectura del body
        this.app.use(express.json());

        // Carpeta pública
        this.app.use(express.static("public"));
    }

    routes() {
        this.app.use(this.apiPaths.perfumes, perfumeRoutes);
        this.app.use(this.apiPaths.genders, genderRoutes);
        this.app.use(this.apiPaths.brands, brandRoutes);
    }
}

export default Server;