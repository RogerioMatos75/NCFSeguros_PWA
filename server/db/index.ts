import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

let db: ReturnType<typeof drizzle>;

async function initDatabase() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
        } : undefined
    });

    try {
        await client.connect();
        db = drizzle(client);
        console.log('Conectado ao banco de dados Neon');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
}

// Inicializa a conexão
initDatabase();

// Exporta a instância do db
export { db };
