import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.json({
        success: true,
        message: 'NCF Seguros API está online!',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        env: process.env.VERCEL_ENV
    });
}
