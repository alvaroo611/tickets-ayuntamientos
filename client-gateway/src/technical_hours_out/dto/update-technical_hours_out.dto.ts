import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnicalHoursOutDto } from './create-technical_hours_out.dto';

export class UpdateTechnicalHoursOutDto extends PartialType(CreateTechnicalHoursOutDto) {}
