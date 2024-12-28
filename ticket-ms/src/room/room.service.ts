import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

import { Repository } from 'typeorm';
import { Room } from './entities/sala.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Department } from 'src/department/entities/department.entity';
import { RpcException } from '@nestjs/microservices';
import { CityCouncil } from 'src/city-council/entities/city-council.entity';


/**
 * Service responsible for managing operations related to rooms.
 * It includes methods to create, update, delete, and fetch rooms,
 * along with handling relationships between rooms and departments.
 * 
 * Key methods:
 * - `getRoomsByCityHall(cityHallId: string)`: Fetch rooms for a specific city hall.
 * - `create(createSalaDto: CreateRoomDto)`: Creates a new room.
 * - `findAll()`: Fetches all rooms.
 * - `findAllActive()`: Fetches active rooms.
 * - `findAllInactive()`: Fetches inactive rooms.
 * - `findOne(idSala: string)`: Fetches a room by ID.
 * - `update(idSala: string, updateSalaDto: UpdateRoomDto)`: Updates an existing room.
 * - `remove(idSala: string)`: Deactivates a room.
 */
@Injectable()
export class SalaService 
{
  /**
   * Injects the necessary repositories for the Room, CityCouncil, and Department entities.
   * These repositories are used to interact with the database.
   * 
   * @param salaRepository Repository for the Room entity.
   * @param ayuntamientoRepository Repository for the CityCouncil entity.
   * @param departmentoRepository Repository for the Department entity.
   */
  constructor(
    @InjectRepository(Room) 
    private salaRepository: Repository<Room>,
    @InjectRepository(CityCouncil) 
    private ayuntamientoRepository: Repository<CityCouncil>,
    @InjectRepository(Department) 
    private departmentoRepository: Repository<Department>,
    
  ) {}

  /**
   * Retrieves all rooms related to a specific CityHall.
   * Verifies the existence of the CityHall, then fetches the associated rooms.
   * 
   * @param cityHallId The ID of the CityHall to retrieve rooms for.
   * @returns A list of rooms belonging to the specified CityHall.
   * @throws NotFoundException if the CityHall is not found.
   */
  async getRoomsByCityHall(cityHallId: string): Promise<Room[]> 
  {
    // Verificar si el ayuntamiento existe
    const cityHall = await this.ayuntamientoRepository.findOne({ where: { id:cityHallId } });
    if (!cityHall) {
      throw new RpcException({message:`City Hall with id ${cityHallId} not found.`,status:HttpStatus.NOT_FOUND});
    }

    // Consultar todas las salas de los departamentos de este ayuntamiento
    const rooms = await this.salaRepository.find({
      where: {
        department: 
        { 
          cityCouncil:
          {
            id: cityHallId 
          }  
                        
        }, // Relación con el ayuntamiento
      },
      relations: ['department'], // Cargar las relaciones necesarias
    });

    return rooms;
  }

  /**
   * Creates a new room.
   * Verifies if the room already exists, checks if the department exists, and creates a new room.
   * 
   * @param createSalaDto The DTO containing data for the new room.
   * @returns The newly created room.
   * @throws RpcException if the room already exists or if there is an error creating the room.
   */
  async create(createSalaDto: CreateRoomDto) 
  {

    try {
      // Verificar si ya existe un registro con el mismo nombre
      const existingSala = await this.salaRepository
      .createQueryBuilder('room')
      .where('room.floor = :floor', { floor: createSalaDto.floor })
      .andWhere('room.office = :office', { office: createSalaDto.office })
      .andWhere('LOWER(room.building) = LOWER(:building)', { building: createSalaDto.building })
      .getOne();
    
      if (existingSala) {
          throw new RpcException({message:'The room already exists ',status: HttpStatus.CONFLICT});
      }

      // Cargar el Departamento con el uso del ID proporcionado
      const departamento = await this.departmentoRepository.findOne({
          where: { departmentId: createSalaDto.departmentId },
      });

      if (!departamento) {
          throw new RpcException({message:'Department not found.', status:HttpStatus.NOT_FOUND});
      }

      // Crear la entidad Departamento y asignar el Ayuntamiento
      const departamentoEntity = this.salaRepository.create({
          ...createSalaDto,
          department: departamento,  
      });

      return await this.salaRepository.save(departamentoEntity);
    } catch (error) {
        
        throw new RpcException(
          { message: `Unexpected error creating record: ${error.message}.`,
            status:HttpStatus.CONFLICT,}
        );
    }
   
  }

  /**
   * Retrieves all rooms from the database.
   * Fetches all rooms along with their department information.
   * 
   * @returns A list of all rooms.
   */
  findAll() 
  {
    return this.salaRepository.find({relations: ['department']});
  }

  /**
   * Retrieves all active rooms.
   * Fetches rooms where the `isActive` field is true.
   * 
   * @returns A list of active rooms.
   */
  async findAllActive() 
  {
    return this.salaRepository.find({
      where: { isActive: true }, 
      relations:  ['department'], 
    });
  }

  /**
   * Retrieves all inactive rooms.
   * Fetches rooms where the `isActive` field is false.
   * 
   * @returns A list of inactive rooms.
   */
  async findAllInactive()
  {
    return this.salaRepository.find({
      where: { isActive: false }, 
      relations:  ['department'], 
    });
  }


  /**
   * Retrieves a specific room by its ID.
   * Verifies if the room exists and returns it.
   * 
   * @param idSala The ID of the room to retrieve.
   * @returns The room with the specified ID.
   * @throws RpcException if the room is not found.
   */
  async findOne(idSala: string) 
  {

    const sala = await this.salaRepository.findOne({where:{roomId: idSala},relations: ['department']});
    
    if(!sala)
    {
      throw new RpcException({message:'Room not found.',status:HttpStatus.NOT_FOUND});
    }

    return sala;
  }

  /**
   * Updates an existing room.
   * Verifies if the room exists, then updates its data along with its department if provided.
   * 
   * @param idSala The ID of the room to update.
   * @param updateSalaDto The DTO containing the updated room data.
   * @returns A success message indicating the room was updated.
   * @throws RpcException if the room or department is not found.
   */
  async update(idSala: string, updateSalaDto: UpdateRoomDto) 
  {
    const sala = await this.salaRepository.findOne({ where: { roomId: idSala } });
    
    if (!sala) {
      throw new RpcException({ message: 'Room not found.', status: HttpStatus.NOT_FOUND });
    }
    const duplicateRoom = await this.salaRepository
    .createQueryBuilder('room')
    .where('room.floor = :floor', { floor: updateSalaDto.floor })
    .andWhere('room.office = :office', { office: updateSalaDto.office })
    .andWhere('LOWER(room.building) = LOWER(:building)', { building: updateSalaDto.building })
    .getOne();

  if (duplicateRoom) {
    throw new RpcException({
      message: 'A room with the same characteristics already exists.',
      status: HttpStatus.CONFLICT,
    });
  }
    // Buscar el nuevo departamento
    if (updateSalaDto.departmentId) {
      const department = await this.departmentoRepository.findOne({ where: { departmentId: updateSalaDto.departmentId } });
      if (!department) {
        throw new RpcException({ message: 'Department not found.', status: HttpStatus.NOT_FOUND });
      }
      sala.department = department;
    }
  
    // Actualizar otros campos
    Object.assign(sala, updateSalaDto);
    await this.salaRepository.save(sala);
    return { message: "Room updated successfully" };
  }
  
   /**
   * Deactivates a room by setting its `isActive` field to false.
   * Verifies if the room is already inactive and prevents deactivation if it is.
   * 
   * @param idSala The ID of the room to deactivate.
   * @returns A success message indicating the room was deactivated.
   * @throws RpcException if the room is already inactive.
   */
  async remove(idSala: string) 
  {
    
    const room = await this.findOne(idSala);

    if(room.isActive == false )
    {
      throw new RpcException({message:`The room is already deactivated`,statusCode: HttpStatus.CONFLICT});
    } 
    else 
    {
      room.isActive = false; 
      await this.salaRepository.save(room); 
      
    } 
  
    return "Room deactivated successfully."; 

  }
}
