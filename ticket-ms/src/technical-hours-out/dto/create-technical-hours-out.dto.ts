import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTechnicalHoursOutDto  {
  
    @IsDate()
    @Type(() => Date)
    fechaInicioSalida: Date;
  
    @IsDate()
    @Type(() => Date)
    fechaFinSalida: Date;
  
    @IsString()
    @IsNotEmpty()
    motivo: string;
    
    @IsOptional()
    @IsBoolean()
    isActive?: boolean ;

    @IsString()
    @IsNotEmpty()
    employeeDni: string;
  }