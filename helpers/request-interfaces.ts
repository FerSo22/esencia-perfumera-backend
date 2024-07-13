import { Request } from "express";

export interface ApiKeyRequest extends Request {
    userRole?: string
};