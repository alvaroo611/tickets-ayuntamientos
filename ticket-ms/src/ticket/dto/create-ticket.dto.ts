import { IsString, IsNotEmpty, IsOptional, IsIn, IsDate, IsNumber, Length, IsPhoneNumber, ValidateNested, IsUUID, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateTicketDto {
    
    @IsString()
    @IsNotEmpty()
    @Length(8, 10) // Asegura que el DNI tenga una longitud entre 8 y 10 caracteres
    requester_dni: string;

    @IsString()
    @IsOptional() // Campo opcional
    notes: string;

    @IsString()
    @IsIn(['en_cumplimiento', 'en_progreso', 'finalizado']) // Valores permitidos
    status: string;

    @IsDate()
    @Type(() => Date)
    appointment_date: Date;

    @IsDate()
    @Type(() => Date)
    creation_date: Date;

    @IsDate()
    @IsOptional() 
    @Type(() => Date)
    attended_date: Date | null;;

    @IsDate()
    @IsOptional() 
    @Type(() => Date)
    completion_date: Date | null;

    @IsString()
    @IsNotEmpty()
    department_name: string;

    @IsString()
    @IsNotEmpty()
    external_user_name: string;

    @IsNotEmpty()
    @IsNumber() // Valida el formato del número de teléfono
    @Min(100000000)
    @Max(999999999) 
    phone: number;
    
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
    
    @IsUUID()
    roomId: string;


    @IsNotEmpty()
    @IsString()
    technicianDNI: string;

    @IsUUID()
    cityHallId: string;
}