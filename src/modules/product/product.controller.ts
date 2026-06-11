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
import { ProductService } from './product.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { ProductDto } from './product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { multerOption } from 'src/common/config/multer.config';
import { RoleGuard } from 'src/common/guard/role.guard';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { EPermission, ERole } from '../user/user.enum';
import { Permission } from 'src/common/decorator/permission.decorator';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @SkipThrottle()
  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getProducts(@Query() query: QueryDto) {
    return this.productService.getProducts(query);
  }

  @Get('listPaging')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getProductsPaging(@QueryPaging() query: QueryDto) {
    return this.productService.getProductsPaging(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getProduct(@Query() query: QueryDto) {
    return this.productService.getProduct(query);
  }

  @Post('create')
  @Roles(ERole.MANAGER, ERole.LEADER)
  @Permission(EPermission.CREATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.CREATED)
  createProduct(@UploadedFile() file: Express.Multer.File, @Body() product: ProductDto) {
    return this.productService.createProduct(file, product);
  }

  @Put('update')
  @Roles(ERole.MANAGER, ERole.LEADER)
  @Permission(EPermission.UPDATE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  updateProduct(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File, @Body() product: ProductDto) {
    return this.productService.updateProduct(query, file, product);
  }

  @Delete('remove')
  @Roles(ERole.MANAGER, ERole.LEADER)
  @Permission(EPermission.REMOVE)
  @UseGuards(JwtGuard, RoleGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  removeProducts(@Query() query: QueryDto) {
    return this.productService.removeProducts(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeProductsPermanent(@Query() query: QueryDto) {
    return this.productService.removeProductsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreProducts() {
    return this.productService.restoreProducts();
  }
}
