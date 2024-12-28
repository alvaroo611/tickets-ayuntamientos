import { Module } from '@nestjs/common';
import { TechnicalHoursOutService } from './technical-hours-out.service';
import { TechnicalHoursOutController } from './technical-hours-out.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalHoursOut } from './entities/technical-hours-out.entity';
import { Employee } from 'src/auth/entities/auth.entity';


@Module({
  imports: [TypeOrmModule.forFeature([TechnicalHoursOut,Employee])],
  controllers: [TechnicalHoursOutController],
  providers: [TechnicalHoursOutService],
})
export class TechnicalHoursOutModule {}
