import { dataSource, userRepository } from '../utils/constants';
import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';

export const userProviders = [
  {
    provide: userRepository,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: [dataSource],
  },
];
