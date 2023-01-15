import * as path from 'path';
import { config } from 'dotenv';
config();

export default () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABESE_PASSWORD,
  database: process.env.DATABASE,
  entities: [path.join('dist', '**', '*.entity.{ts,js}')],
  synchronize: true,
  migrations: ['dist/migrations/**/*.js'],
  cli: { migrationsDir: 'src/migrations' },
});
