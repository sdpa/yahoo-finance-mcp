import dotenv from 'dotenv';
dotenv.config();

export interface Config {
    port: number;
    isProduction: boolean;
}

export function loadConfig(): Config {
    const port = parseInt(process.env.PORT || '8080', 10);
    const isProduction = process.env.NODE_ENV === 'production';

    return { port, isProduction };
}
