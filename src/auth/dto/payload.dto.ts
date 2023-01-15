import { Role } from '../../user/enums/role.enum';

export class PayloadDto {
  email: string;
  sub: number;
  role: Role;
}
