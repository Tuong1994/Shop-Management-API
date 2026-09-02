import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { LoanHelper } from './loan.helper';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LoanController],
  providers: [LoanService, LoanHelper],
})
export class LoanModule implements NestModule {
    constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: "loan",
      routes: [
        {
          path: "api/loan/detail",
          method: RequestMethod.GET
        },
        {
          path: "api/loan/update",
          method: RequestMethod.PUT
        },
      ]
    })
     applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: "userLoan",
      routes: [
        {
          path: "api/loan/payLoan",
          method: RequestMethod.POST
        },
      ]
    })
  }
}
