import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { BillService } from './bill.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { SkipThrottle } from '@nestjs/throttler';

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
}
