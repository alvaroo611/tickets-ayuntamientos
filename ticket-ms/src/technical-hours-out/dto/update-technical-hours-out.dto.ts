import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnicalHoursOutDto } from './create-technical-hours-out.dto';

export class UpdateTechnicalHoursOutDto extends PartialType(CreateTechnicalHoursOutDto) {
  id: string;
}
