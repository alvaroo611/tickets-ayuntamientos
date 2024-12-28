import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsDate,
  IsNumber,
  Length,
  Min,
  Max,
  IsPhoneNumber,
  IsBoolean,
  IsUUID
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 10)
  requester_dni: string;

  @IsString()
  @IsOptional()
  notes: string|undefined;

  @IsString()
  @IsIn(['en_cumplimiento', 'en_progreso', 'finalizado'])
  status: string;


  appointment_date: string;


  creation_date: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  attended_date: string | null;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  completion_date: string | null;

  @IsString()
  @IsNotEmpty()
  department_name: string;

  @IsString()
  @IsNotEmpty()
  external_user_name: string;

  @IsNotEmpty()
  @IsNumber()
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

  constructor(
      requester_dni: string,
      status: string,
      appointment_date: string,
      creation_date: string,
      department_name: string,
      external_user_name: string,
      phone: number,
      roomId: string,
      technicianDNI: string,
      cityHallId: string,
      notes?: string,
      attended_date?: string | null,
      completion_date?: string | null,
      isActive?: boolean
  ) {
      this.requester_dni = requester_dni;
      this.status = status;
      this.appointment_date = appointment_date;
      this.creation_date = creation_date;
      this.department_name = department_name;
      this.external_user_name = external_user_name;
      this.phone = phone;
      this.roomId = roomId;
      this.technicianDNI = technicianDNI;
      this.cityHallId = cityHallId;
      this.notes = notes;
      this.attended_date = attended_date ?? null;
      this.completion_date = completion_date ?? null;
      this.isActive = isActive;
  }
}
