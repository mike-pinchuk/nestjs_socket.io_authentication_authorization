import { Inject, Injectable } from '@nestjs/common';
import { hashGenerator } from '../utils/hashString';
import { Repository } from 'typeorm';
import { userRepository } from '../utils/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(userRepository) private usersRepository: Repository<UserEntity>,
  ) {}

  public async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  public async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  public async create(dataDto: CreateUserDto): Promise<UserEntity> {
    return this.usersRepository.save({
      ...dataDto,
      password: hashGenerator(dataDto.password),
    });
  }

  public async setCurrentRefreshToken(
    token: string,
    userId: number,
  ): Promise<void> {
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: hashGenerator(token),
    });
  }

  public async getRefreshToMatching(
    token: string,
    userId: number,
  ): Promise<ReturnUserDto> {
    const currentUser = await this.getById(userId);
    if (currentUser.currentHashedRefreshToken === hashGenerator(token)) {
      const { password, currentHashedRefreshToken, ...result } = currentUser;
      return result;
    }
  }

  private async getById(userId: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return user;
  }

  public async removeRefreshToken(email: string): Promise<void> {
    await this.usersRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ currentHashedRefreshToken: null })
      .where('email = :email', { email: email })
      .execute();
  }
}
