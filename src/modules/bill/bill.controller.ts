import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BillService } from './bill.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { BillDto } from './bill.dto';

@Controller('api/bill')
export class BillController {
  constructor(private billService: BillService) {}

  @SkipThrottle()
  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getBills(@Query() query: QueryDto) {
    return this.billService.getBills(query);
  }

  @Get('listPaging')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getBillsPaging(@QueryPaging() query: QueryDto) {
    return this.billService.getBillsPaging(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getBill(@Query() query: QueryDto) {
    return this.billService.getBill(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createBill(@Body() bill: BillDto) {
    return this.billService.createBill(bill);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateBill(@Query() query: QueryDto, @Body() bill: BillDto) {
    return this.billService.updateBill(query, bill);
  }

  @Delete('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeBill(@Query() query: QueryDto) {
    return this.billService.removeBill(query);
  }

  @Delete('removePermanent')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removePermanent(@Query() query: QueryDto) {
    return this.billService.removeBillPernament(query);
  }

  @Post('restore')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  restoreBills() {
    return this.billService.restoreBills();
  }
}
