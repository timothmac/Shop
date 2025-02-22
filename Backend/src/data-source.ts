import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные окружения

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'store',
  entities: [__dirname + '/../modules/**/entities/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.js'],
  synchronize: true, // Отключаем в продакшене, включаем миграции
  logging: true,
});
