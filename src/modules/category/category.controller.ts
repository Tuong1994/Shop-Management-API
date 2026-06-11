import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/config/multer.config';
import { CategoryDto } from './category.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { Roles } from 'src/common/decorator/role.decorator';
import { EPermission, ERole } from '../user/user.enum';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import { Permission } from 'src/common/decorator/permission.decorator';

@Controller('api/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @SkipThrottle()
  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getCategories(@Query() query: QueryDto) {
    return this.categoryService.getCategories(query);
  }

  @Get('listPaging')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getCategoriesPaging(@QueryPaging() query: QueryDto) {
    return this.categoryService.getCategoriesPaging(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getCategory(@Query() query: QueryDto) {
    return this.categoryService.getCategory(query);
  }

  @Post('create')
  @Roles(ERole.MANAGER, ERole.LEADER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.CREATED)
  createCategory(@UploadedFile() file: Express.Multer.File, @Body() category: CategoryDto) {
    return this.categoryService.createCategory(file, category);
  }

  @Put('update')
  @Roles(ERole.MANAGER, ERole.LEADER)
  @Permission(EPermission.UPDATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  updateCategory(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File, @Body() category: CategoryDto) {
    return this.categoryService.updateCategory(query, file, category);
  }

  @Delete('remove')
  @Roles(ERole.MANAGER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeCategories(@Query() query: QueryDto) {
    return this.categoryService.removeCategories(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeCategoriesPermanent(@Query() query: QueryDto) {
    return this.categoryService.removeCategoriesPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreCategories() {
    return this.categoryService.restoreCategories();
  }
}
