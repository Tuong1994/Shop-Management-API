import { SetMetadata } from '@nestjs/common';
import { EPermission } from 'src/modules/user/user.enum';

export const Permission = (permission: EPermission) => SetMetadata('permission', permission);
