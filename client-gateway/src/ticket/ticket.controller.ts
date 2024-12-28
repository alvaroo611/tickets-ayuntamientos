import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpException, HttpStatus } from '@nestjs/common';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {  TICKET_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';

/**
 * Controller for managing Ticket entities.
 * Handles CRUD operations for ticket records.
 */
@Controller('ticket')
export class TicketController 
{
  /**
   * Constructor that injects the ClientProxy for communication with the ticket service.
   * @param client - The client used to send messages to the ticket service via microservices.
   */
  constructor( @Inject(TICKET_SERVICE) private readonly client:ClientProxy) {}

  /**
   * Creates a new Ticket record.
   * @param createTicketDto - The data transfer object containing the ticket details.
   * @returns The result of the creation operation.
   */
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) 
  {
    return this.client.send('createTicket', createTicketDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all Ticket records.
   * @returns A list of all tickets.
   */
  @Get()
  findAll() 
  {
    return  this.client.send('findAllTicket', {}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all active Ticket records.
   * @returns A list of active tickets.
   */
  @Get('active')
  findAllActive() 
  {
    return this.client.send('findAllActiveTicket',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all inactive Ticket records.
   * @returns A list of inactive tickets.
   */
  @Get('inactive')
  findAllInactive()
  {
    return this.client.send('findAllInactiveTicket',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves a specific Ticket record by its ID.
   * @param id_ticket - The ID of the ticket to be retrieved.
   * @returns The requested ticket record.
   */
  @Get(':id')
  findOne(@Param('id') id_ticket: string) 
  {
    return  this.client.send('findOneTicket', id_ticket).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
  /**
   * Updates a specific Ticket record by its ID.
   * @param id - The ID of the ticket to be updated.
   * @param updateTicketDto - The data transfer object containing updated ticket details.
   * @returns The result of the update operation.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) 
  {
    updateTicketDto.id=id;
    return  this.client.send('updateTicket', updateTicketDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

   /**
   * Deletes a specific Ticket record by its ID.
   * @param id_ticket - The ID of the ticket to be deleted.
   * @returns The result of the delete operation.
   */
  @Delete(':id')
  remove(@Param('id') id_ticket: string) 
  {
    return  this.client.send('removeTicket', id_ticket).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
}
