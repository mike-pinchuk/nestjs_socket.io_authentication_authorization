import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { MessageEntity } from './message.entity';
import { Repository } from 'typeorm';
import { messageRepository } from '../utils/constants';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    @Inject(messageRepository)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async saveMessage(
    content: string,
    author: UserEntity,
  ): Promise<MessageEntity> {
    const newMessage = await this.messageRepository.create({
      content,
      author,
    });
    await this.messageRepository.save(newMessage);
    return newMessage;
  }

  async getAllMessages() {
    return this.messageRepository.find({
      relations: ['author'],
    });
  }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication } = parse(cookie);
    const user = await this.authService.getUserFromAuthToken(Authentication);

    if (!user) {
      throw new WsException('Invalid credential');
    }
    return user;
  }
}
