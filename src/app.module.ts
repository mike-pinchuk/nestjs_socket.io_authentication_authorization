import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/database';
import { databaseProviders } from './database/database.provider';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], load: [configuration] }),
    UserModule,
    AuthModule,
    DatabaseModule,
    ChatModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
