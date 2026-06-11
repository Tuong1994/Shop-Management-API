import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { RoleGuard } from 'src/common/guard/role.guard';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserDto } from 'src/modules/user/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/config/multer.config';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import { Permission } from 'src/common/decorator/permission.decorator';
import { ERole, EPermission } from './user.enum';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getUsers(@QueryPaging() query: QueryDto) {
    return this.userService.getUsers(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getUser(@Query() query: QueryDto) {
    return this.userService.getUser(query);
  }

  @Post('create')
  @Roles(ERole.MANAGER, ERole.LEADER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.CREATED)
  createUser(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File, @Body() user: UserDto) {
    return this.userService.createUser(query, file, user);
  }

  @Put('update')
  @Roles(ERole.MANAGER, ERole.LEADER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  updateUser(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File, @Body() user: UserDto) {
    return this.userService.updateUser(query, file, user);
  }

  @Delete('remove')
  @Roles(ERole.MANAGER, ERole.LEADER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeUsers(@Query() query: QueryDto) {
    return this.userService.removeUsers(query);
  }

  @Delete('removeAddress')
  @Roles(ERole.MANAGER, ERole.LEADER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeAddress(@Query() query: QueryDto) {
    return this.userService.removeAddress(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeUsersPermanent(@Query() query: QueryDto) {
    return this.userService.removeUsersPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreUsers() {
    return this.userService.restoreUsers();
  }
}
