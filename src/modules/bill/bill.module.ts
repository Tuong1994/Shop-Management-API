import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { PrismaService } from '../prisma/prisma.service';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';

@Module({
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'bill',
      routes: [
        {
          path: 'api/bill/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/bill/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
