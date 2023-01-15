import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Type,
  mixin,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../user/roles.decorator';
import { Role } from '../../user/enums/role.enum';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from './jwt-auth.guard';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles) {
//       return true;
//     }
//     const { user } = context.switchToHttp().getRequest();
//     return requiredRoles.some((role) => user.roles?.includes(role));
//   }
// }
export const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(
      context: ExecutionContext, // : Promise<boolean | Promise<boolean> | Observable<boolean>>
    ) {
      const request = context.switchToHttp().getRequest<any>();
      await super.canActivate(context);

      const user = request.user;
      return user?.role.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};
