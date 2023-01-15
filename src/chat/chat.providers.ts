import { dataSource, messageRepository } from '../utils/constants';
import { DataSource } from 'typeorm';
import { MessageEntity } from './message.entity';

export const messageProviders = [
  {
    provide: messageRepository,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MessageEntity),
    inject: [dataSource],
  },
];
