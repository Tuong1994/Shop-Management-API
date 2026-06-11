import { SetMetadata } from '@nestjs/common';
import { ERole } from 'src/modules/user/user.enum';

export const Roles = (...roles: ERole[]) => SetMetadata('role', roles);
