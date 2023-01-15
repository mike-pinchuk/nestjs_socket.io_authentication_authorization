import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReturnUserDto } from './dto/return-user.dto';
import { Role } from './enums/role.enum';
import { Roles } from './roles.decorator';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Roles(Role.Admin)
  @UseGuards(RoleGuard(Role.Admin))
  // @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllUsers(): Promise<ReturnUserDto[]> {
    const allUsers = await this.userService.findAll();
    return allUsers.map((e) => {
      const { password, currentHashedRefreshToken, ...result } = e;
      return result;
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOneByEmail(@Query('email') email: string): Promise<ReturnUserDto> {
    const user = await this.userService.findByEmail(email);
    const { password, currentHashedRefreshToken, ...result } = user;
    return result;
  }
}
