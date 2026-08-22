import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GrowthController } from './growth.controller';
import { GrowthService } from './growth.service';
import { GrowthHelper } from './growth.helper';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GrowthController],
  providers: [GrowthService, GrowthHelper],
})
export class GrowthModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'growth',
      routes: [
        {
          path: 'api/growth/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/growth/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
