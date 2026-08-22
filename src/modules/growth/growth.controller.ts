import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GrowthService } from './growth.service';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { QueryDto } from 'src/common/dto/query.dto';
import { GrowthDto, UserGrowthDto } from './growth.dto';

@Controller('api/growth')
export class GrowthController {
  constructor(private growthService: GrowthService) {}

  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getGrowths(@Query() query: QueryDto) {
    return this.growthService.getGrowths(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getGrowth(@Query() query: QueryDto) {
    return this.growthService.getGrowth(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createGrowth(@Body() growth: GrowthDto) {
    return this.growthService.createGrowth(growth);
  }

  @Post('purchase')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  purchaseGrowth(@Body() userGrowth: UserGrowthDto) {
    return this.growthService.purchaseGrowth(userGrowth);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateGrowth(@Query() query: QueryDto, @Body() growth: GrowthDto) {
    return this.growthService.updateGrowth(query, growth);
  }

  @Delete('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeGrowths(@Query() query: QueryDto) {
    return this.growthService.removeGrowths(query);
  }

  @Delete('removePermanent')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeGrowthsPermanent(@Query() query: QueryDto) {
    return this.growthService.removeGrowthsPermanent(query);
  }

  @Post('restore')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  restoreGrowths() {
    return this.growthService.restoreGrowths();
  }
}
