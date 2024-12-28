import { Type } from 'class-transformer';
import { IsDate, IsInt, IsUUID, Min, Max } from 'class-validator';

export class CreateDepartmentConfigurationDto {

  @IsDate()
  @Type(() => Date)
  horaInicio: Date;

  @IsDate()
  @Type(() => Date)
  horaFinal: Date;

  @IsInt()
  @Min(1)
  @Max(120)
  intervalo: number;

  @IsUUID()
  departmentId: string;

  constructor(horaInicio: Date, horaFinal: Date, intervalo: number, departmentId: string) {
    this.horaInicio = horaInicio;
    this.horaFinal = horaFinal;
    this.intervalo = intervalo;
    this.departmentId = departmentId;
  }
}
