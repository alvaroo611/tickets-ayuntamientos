import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTechnicalHoursOutDto {

    @IsString()
    fechaInicioSalida: string;

     @IsString()
    fechaFinSalida: string;

    @IsString()
    @IsNotEmpty()
    motivo: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsString()
    @IsNotEmpty()
    employeeDni: string;

    constructor(
        fechaInicioSalida: string,
        fechaFinSalida: string,
        motivo: string,
        employeeDni: string,
        isActive?: boolean
    ) {
        this.fechaInicioSalida = fechaInicioSalida;
        this.fechaFinSalida = fechaFinSalida;
        this.motivo = motivo;
        this.employeeDni = employeeDni;
        this.isActive = isActive;
    }
}
