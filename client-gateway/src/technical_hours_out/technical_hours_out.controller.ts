import {  Controller, Get, Post, Body, Patch,  Param,  Delete, Inject, HttpException, HttpStatus} from '@nestjs/common';
 
import { ClientProxy } from '@nestjs/microservices';

import { catchError, firstValueFrom } from 'rxjs';
import { TICKET_SERVICE } from 'src/config/services';
import { CreateTechnicalHoursOutDto } from './dto/create-technical_hours_out.dto';
import { UpdateTechnicalHoursOutDto } from './dto/update-technical_hours_out.dto';

/**
 * Controller for managing Technical Hours Out entities.
 * Handles CRUD operations for technical hours records.
 */
@Controller('technical-hours-out')
export class TechnicalHoursOutController 
{
  /**
   * Constructor that injects the ClientProxy for communication with the ticket service.
   * @param client - The client used to send messages to the ticket service via microservices.
   */
  constructor(
    @Inject(TICKET_SERVICE) 
    private readonly client: ClientProxy,
  ) {}

  /**
   * Creates a new Technical Hours Out record.
   * @param createTechnicalHoursOutDto - The data transfer object containing the technical hours details.
   * @returns The result of the creation operation.
   */
  @Post()
  async create(@Body() createTechnicalHoursOutDto: CreateTechnicalHoursOutDto) 
  {
    // Llamar al microservicio para crear un nuevo registro
    return await firstValueFrom(
      this.client.send('createTechnicalHoursOut', createTechnicalHoursOutDto).pipe(
        catchError(err => {
          // Convertir el error de RPC en una excepción HTTP para el cliente
          throw new HttpException(
            err.message || 'Internal Server Error', 
            err.status || HttpStatus.INTERNAL_SERVER_ERROR
          );
        })
      ),
    );
    
  }

   /**
   * Retrieves all Technical Hours Out records.
   * @returns A list of all technical hours out records.
   */
  @Get()
  async findAll() 
  {
    // Llamar al microservicio para obtener todos los registros
    return await firstValueFrom(
      this.client.send('findAllTechnicalHoursOut', {}).pipe(
        catchError(err => {
          // Convertir el error de RPC en una excepción HTTP para el cliente
          throw new HttpException(
            err.message || 'Internal Server Error', 
            err.status || HttpStatus.INTERNAL_SERVER_ERROR
          );
        })
      ),
    );
  }


  /**
   * Retrieves a specific Technical Hours Out record by its ID.
   * @param id - The ID of the record to be retrieved.
   * @returns The requested technical hours out record.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) 
  {
    // Llamar al microservicio para obtener un registro específico
    return await firstValueFrom(
      this.client.send('findOneTechnicalHoursOut', id).pipe(
        catchError(err => {
          // Convertir el error de RPC en una excepción HTTP para el cliente
          throw new HttpException(
            err.message || 'Internal Server Error', 
            err.status || HttpStatus.INTERNAL_SERVER_ERROR
          );
        })
      ),
    );
  }


  /**
   * Updates a specific Technical Hours Out record by its ID.
   * @param id - The ID of the record to be updated.
   * @param updateTechnicalHoursOutDto - The data transfer object containing updated technical hours out details.
   * @returns The result of the update operation.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateTechnicalHoursOutDto: UpdateTechnicalHoursOutDto,
  ) {
    // Llamar al microservicio para actualizar un registro específico
    return await firstValueFrom(
      this.client.send('updateTechnicalHoursOut', {
        id,
        ...updateTechnicalHoursOutDto,
      }).pipe(
        catchError(err => {
          // Convertir el error de RPC en una excepción HTTP para el cliente
          throw new HttpException(
            err.message || 'Internal Server Error', 
            err.status || HttpStatus.INTERNAL_SERVER_ERROR
          );
        })
      ),
    );
  }

 
}
