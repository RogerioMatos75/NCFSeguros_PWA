import { Request } from 'express';
import { VercelRequest } from '@vercel/node';

declare global {
    namespace Express {
        export interface Request extends VercelRequest { }
    }
}
