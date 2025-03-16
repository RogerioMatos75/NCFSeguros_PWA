import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Rota básica para teste
app.get('/api/health', (_, res) => {
    res.json({ status: 'ok' });
});

export default function handler(req: VercelRequest, res: VercelResponse) {
    return app(req, res);
}
