import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalaService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller()
export class SalaController 
{

  /**
   * Injects the SalaService into the controller.
   * The SalaService is used for business logic related to rooms.
   *
   * @param salaService The service to handle room-related operations.
   */
  constructor(private readonly salaService: SalaService) {}


  /**
   * Creates a new room.
   * Receives the room creation data and calls SalaService to create a room.
   *
   * @param createSalaDto The DTO containing the data required to create a room.
   * @returns A response with the result of the room creation.
   */
  @MessagePattern('createSala')
  create(@Payload() createSalaDto: CreateRoomDto) 
  {
    return this.salaService.create(createSalaDto);
  }

  /**
   * Retrieves rooms by the CityHall ID.
   * Receives the CityHall ID and calls SalaService to fetch the rooms associated with it.
   *
   * @param cityHallId The ID of the CityHall to retrieve rooms for.
   * @returns A list of rooms for the specified CityHall.
   */
  @MessagePattern('getRoomsByCityHall')
  getRoomsByCityHall(@Payload() cityHallId: string) 
  {
    return this.salaService.getRoomsByCityHall(cityHallId);
  }

  /**
   * Retrieves all rooms.
   * Calls SalaService to fetch all rooms in the system.
   *
   * @returns A list of all rooms.
   */
  @MessagePattern('findAllSala')
  findAll() 
  {
    return this.salaService.findAll();
  }

  /**
   * Retrieves all active rooms.
   * Calls SalaService to fetch rooms that are currently active.
   *
   * @returns A list of active rooms.
   */
  @MessagePattern('findAllActiveSala')
  findAllActive() 
  {
    
    return this.salaService.findAllActive();
  }


  /**
   * Retrieves all inactive rooms.
   * Calls SalaService to fetch rooms that are currently inactive.
   *
   * @returns A list of inactive rooms.
   */
  @MessagePattern('findAllInactiveSala')
  findAllInactive() 
  {
    
    return this.salaService.findAllInactive();
  }


  /**
   * Retrieves a specific room by its ID.
   * Calls SalaService to fetch a room based on the provided ID.
   *
   * @param id The ID of the room to retrieve.
   * @returns The room with the specified ID.
   */
  @MessagePattern('findOneSala')
  findOne(@Payload() id: string) 
  {
    return this.salaService.findOne(id);
  }


  /**
   * Updates an existing room.
   * Validates if the room exists and updates it using the provided information.
   *
   * @param updateSalaDto The DTO containing the updated room data.
   * @returns A response with the result of the room update.
   */
  @MessagePattern('updateSala')
  update(@Payload() updateSalaDto: UpdateRoomDto) 
  {
    return this.salaService.update(updateSalaDto.idSala, updateSalaDto);
  }


  /**
   * Removes a room.
   * Calls SalaService to remove the room based on its ID.
   *
   * @param idSala The ID of the room to remove.
   * @returns A success message if the room was removed.
   */
  @MessagePattern('removeSala')
  remove(@Payload() idSala: string) 
  {
    return this.salaService.remove(idSala);
  }
}
