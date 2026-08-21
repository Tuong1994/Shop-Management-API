import { Controller } from '@nestjs/common';
import { GrowthService } from './growth.service';

@Controller('api/growth')
export class GrowthController {
  constructor(private growthService: GrowthService) {}
}
