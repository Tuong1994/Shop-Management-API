import { Module } from '@nestjs/common';
import { GrowthController } from './growth.controller';
import { GrowthService } from './growth.service';
import { GrowthHelper } from './growth.helper';

@Module({
  controllers: [GrowthController],
  providers: [GrowthService, GrowthHelper],
})
export class GrowthModule {}
