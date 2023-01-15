import { DataSource } from 'typeorm';
import * as path from 'path';
import { config } from 'dotenv';
import { dataSource } from '../utils/constants';
config();

export const databaseProviders = [
  {
    provide: dataSource,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABESE_PASSWORD,
        database: process.env.DATABASE,
        entities: [path.join('dist', '**', '*.entity.{ts,js}')],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
