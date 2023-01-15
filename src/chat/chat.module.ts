import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { messageProviders } from './chat.providers';
import { ChatService } from './chat.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [...messageProviders, ChatService, ChatGateway],
  exports: [ChatService],
  controllers: [],
})
export class ChatModule {}
