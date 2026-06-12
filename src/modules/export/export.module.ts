import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { ExportHelper } from './export.helper';

@Module({
  controllers: [ExportController],
  providers: [ExportService, ExportHelper],
})
export class ExportModule {}
