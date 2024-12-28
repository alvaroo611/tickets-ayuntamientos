import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpStatus, HttpException } from '@nestjs/common';

import { TICKET_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { catchError } from 'rxjs';
/**
 * Controller for managing Room entities.
 * Handles CRUD operations for Room management.
 */
@Controller('sala')
export class SalaController 
{
  /**
   * Constructor that injects the ClientProxy for communication with the ticket service.
   * @param client - The client used to send messages to the ticket service via microservices.
   */
  constructor(@Inject(TICKET_SERVICE) private readonly client:ClientProxy) {}

  /**
   * Creates a new Room.
   * @param createRoomDto - The data transfer object containing room details.
   * @returns The result of the creation operation.
   */
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) 
  {
    return this.client.send('createSala', createRoomDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all rooms for a specific City Hall.
   * @param cityHallId - The ID of the City Hall for which rooms are being fetched.
   * @returns A list of rooms associated with the given City Hall.
   */
  @Get('/cityhall/:cityHallId')
  getRoomsByCityHall(@Param('cityHallId') cityHallId: string)
  {
    return this.client.send('getRoomsByCityHall', cityHallId).pipe(
      catchError(err => {
        throw new HttpException(
          err.message || 'Internal Server Error',
          err.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  /**
   * Retrieves all Room entities.
   * @returns A list of all Room entities.
   */
  @Get()
  findAll() 
  {
    return this.client.send('findAllSala', {}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

   /**
   * Retrieves all active Room entities.
   * @returns A list of active Room entities.
   */
  @Get('active')
  findAllActive() 
  {
    return this.client.send('findAllActiveSala',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }


  /**
   * Retrieves all inactive Room entities.
   * @returns A list of inactive Room entities.
   */
  @Get('inactive')
  findAllInactive() 
  {
    return this.client.send('findAllInactiveSala',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves a specific Room by its ID.
   * @param id_sala - The ID of the Room to be retrieved.
   * @returns The requested Room entity.
   */
  @Get(':id')
  findOne(@Param('id') id_sala: string) 
  {
    return this.client.send('findOneSala', id_sala).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Updates a specific Room by its ID.
   * @param roomId - The ID of the Room to be updated.
   * @param updateRoomDto - The data transfer object containing updated room details.
   * @returns The result of the update operation.
   */
  @Patch(':id')
  update(@Param('id') roomId: string, @Body() updateRoomDto: UpdateRoomDto) 
  {
    updateRoomDto.roomId=roomId;
    return this.client.send('updateSala', updateRoomDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }


  /**
   * Deactivated a specific Room by its ID.
   * @param idSala - The ID of the Room to be deactiavte.
   * @returns The result of the deactiavte operation.
   */
  @Delete(':id')
  remove(@Param('id') idSala: string) 
  {
    return this.client.send('removeSala', idSala).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
}
