import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL_ENV
    });
}
