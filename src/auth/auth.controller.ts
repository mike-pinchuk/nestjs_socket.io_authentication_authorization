import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ReturnUserDto } from '../user/dto/return-user.dto';
import { AuthService } from './auth.service';
import { PayloadDto } from './dto/payload.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(201)
  @Post('register')
  public async register(
    @Body() registerData: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const cookie = await this.authService.register(registerData);
    response.cookie('Authorization', cookie.access_token, {
      httpOnly: true,
    });
    response.cookie('Refresh', cookie.refresh_token, {
      httpOnly: true,
    });
    return 'User was created';
  }

  @HttpCode(200)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ReturnUserDto> {
    const cookie = await this.authService.login(req.user);
    response.cookie('Authorization', cookie.access_token, {
      httpOnly: true,
    });
    response.cookie('Refresh', cookie.refresh_token, {
      httpOnly: true,
    });
    const { password, currentHashedRefreshToken, role, ...result } = req.user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  public async logOut(
    @Request() request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    response.cookie('Authorization', '', { httpOnly: true });
    response.cookie('Refresh', '', { httpOnly: true });
    await this.userService.removeRefreshToken(request.user.email);
    return `User was log out`;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public async refresh(
    @Request() request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ReturnUserDto> {
    const payload: PayloadDto = {
      email: request.user.email,
      sub: request.user.id,
      role: request.user.role,
    };
    const accessTokenCookie = await this.authService.getAccessToken(payload);

    response.cookie('Authorization', accessTokenCookie, {
      httpOnly: true,
    });

    return request.user;
  }
}
