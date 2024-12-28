import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpException, HttpStatus } from '@nestjs/common';



import { TICKET_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCityCouncilDto } from './dto/create-city-council.dto';
import { UpdateCityCouncilDto } from './dto/update-city-council.dto';
import { catchError } from 'rxjs';

/**
 * Controller for managing City Councils.
 * Handles all CRUD operations related to City Councils.
 */
@Controller('ayuntamiento')
export class CityCouncilController 
{
  /**
   * Constructor that injects the ClientProxy to communicate with the ticket service.
   * @param client - The client used to communicate with the ticket service via microservices.
   */
  constructor(@Inject(TICKET_SERVICE) private readonly client:ClientProxy) {}

   /**
   * Creates a new City Council.
   * @param createCityCouncilDto - The data transfer object containing the details of the City Council to be created.
   * @returns The result of the operation.
   */
  @Post()
  create(@Body() createCityCouncilDto: CreateCityCouncilDto) 
  {
    return this.client.send('createCityCouncil', createCityCouncilDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all City Councils.
   * @returns The list of all City Councils.
   */
  @Get()
  findAll() 
  {
    return this.client.send('findAllCityCouncil',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all active City Councils.
   * @returns The list of all active City Councils.
   */
  @Get('active')
  findAllActive() 
  {
    return this.client.send('findAllActiveCityCouncil',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves all inactive City Councils.
   * @returns The list of all inactive City Councils.
   */
  @Get('inactive')
  findAllInactive() 
  {
    return this.client.send('findAllInactiveCityCouncil',{}).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Retrieves a specific City Council by its ID.
   * @param id - The ID of the City Council to be retrieved.
   * @returns The requested City Council.
   */
  @Get(':id')
  findOne(@Param('id') id: string) 
  {
    return this.client.send('findOneCityCouncil',id).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Updates a City Council by its ID.
   * @param id - The ID of the City Council to be updated.
   * @param updateCityCouncilDto - The data transfer object containing the updated details.
   * @returns The result of the update operation.
   */
  @Patch(':id')
  update(@Param('id') id: string,@Body() updateCityCouncilDto: UpdateCityCouncilDto) 
  {
    updateCityCouncilDto.id=id;
    return this.client.send('updateCityCouncil',updateCityCouncilDto).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   * Deletes a City Council by its ID.
   * @param id - The ID of the City Council to be deleted.
   * @returns The result of the delete operation.
   */
  @Delete(':id')
  remove(@Param('id') id: string) 
  {
    return this.client.send('removeCityCouncil',id).pipe(
      catchError(err => {
        // Convertir el error de RPC en una excepción HTTP para el cliente
        throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
}
