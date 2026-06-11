import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductHelper } from './product.helper';
import { applyCheckIdMiddleware } from 'src/common/middleware/applyFn.middleware';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductHelper],
})
export class ProductModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    applyCheckIdMiddleware({
      consumer,
      prisma: this.prisma,
      schema: 'product',
      routes: [
        {
          path: 'api/product/detail',
          method: RequestMethod.GET,
        },
        {
          path: 'api/product/update',
          method: RequestMethod.PUT,
        },
      ],
    });
  }
}
