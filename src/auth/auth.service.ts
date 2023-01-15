import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hashGenerator } from '../utils/hashString';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ReturnUserDto } from '../user/dto/return-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { jwtConstants, refreshConstants } from '../utils/constants';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<ReturnUserDto> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === hashGenerator(password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new HttpException('ERROR: Wrong credentials', HttpStatus.BAD_REQUEST);
  }

  async register(data: CreateUserDto): Promise<any> {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      const user = await this.userService.create(data);
      const payload: PayloadDto = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };
      const refreshToken = await this.getRefreshToken(payload);
      await this.userService.setCurrentRefreshToken(refreshToken, user.id);

      return {
        access_token: await this.getAccessToken(payload),
        refresh_token: refreshToken,
      };
    }
    throw new HttpException(
      'ERROR: User with this email already exists',
      HttpStatus.BAD_REQUEST,
    );
  }

  async login(user: any): Promise<any> {
    const payload: PayloadDto = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    const refreshToken = await this.getRefreshToken(payload);
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    return {
      access_token: await this.getAccessToken(payload),
      refresh_token: refreshToken,
    };
  }

  private async getRefreshToken(payload: PayloadDto): Promise<string> {
    const refTok = await this.jwtService.sign(payload, {
      secret: refreshConstants.secret,
      expiresIn: refreshConstants.expiresIn,
    });
    return refTok;
  }

  public async getAccessToken(payload: PayloadDto): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresIn,
    });
  }

  public async getUserFromAuthToken(token: string) {
    const payload: PayloadDto = this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });

    if (payload.email) {
      return this.userService.findByEmail(payload.email);
    }
  }
}
