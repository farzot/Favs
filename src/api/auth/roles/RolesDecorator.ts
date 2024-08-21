import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/common/database/Enums';

export const RolesDecorator = (...args: Roles[]) => SetMetadata('roles', args);
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
