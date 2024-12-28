import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Between, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';

import { Employee } from 'src/auth/entities/auth.entity';
import { CityCouncil } from 'src/city-council/entities/city-council.entity';
import { Room } from 'src/room/entities/sala.entity';
import { RpcException } from '@nestjs/microservices';

/**
 * Service for managing tickets.
 * This service contains business logic for creating, retrieving, updating, and removing tickets.
 */
@Injectable()
export class TicketService {

   /**
   * Constructor to inject repositories for the necessary entities.
   * 
   * @param ticketRepository Repository for handling `Ticket` entity.
   * @param ayuntamientoRepository Repository for handling `CityCouncil` entity.
   * @param salaRepository Repository for handling `Room` entity.
   * @param authRepository Repository for handling `Employee` entity.
   */
  constructor(
    @InjectRepository(Ticket) 
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(CityCouncil) 
    private ayuntamientoRepository: Repository<CityCouncil>,
    @InjectRepository(Room) 
    private salaRepository: Repository<Room>,
    @InjectRepository(Employee) 
    private authRepository: Repository<Employee>,
  ) {}


   /**
   * Creates a new ticket based on the provided DTO.
   * It validates if the required entities (city council, room, and technician) exist and then creates the ticket.
   * 
   * @param createTicketDto The DTO containing the ticket data to be created.
   * @returns A success message if the ticket is created successfully.
   * @throws RpcException if any related entity (city hall, room, technician) is not found.
   * @throws RpcException if apointmment select already selected
   */
  async create(createTicketDto: CreateTicketDto) 
  {

    try {
      
     
      // Cargar el Ayuntamiento con el uso del ID proporcionado
      const ayuntamiento = await this.ayuntamientoRepository.findOne({
          where: { id: createTicketDto.cityHallId },
      });
       // Cargar la sala con el uso del ID proporcionado
       const sala = await this.salaRepository.findOne({
        where: { roomId: createTicketDto.roomId },
        relations: ['department'], // Esto carga la relación con el departamento
      });
      
      const tecnico = await this.authRepository.findOne({
        where: { DNI: createTicketDto.technicianDNI },
      });
      if (!ayuntamiento) {
          throw new RpcException({message:'The registered town hall was not found.', status:HttpStatus.NOT_FOUND});
      }
      if (!sala) {
        throw new RpcException({message:'The searched room was not found.',status: HttpStatus.NOT_FOUND});
      }
      if (!tecnico) {
        throw new RpcException({message:'The registered technician was not found.', status:HttpStatus.NOT_FOUND});
      }
      const startOfDay = new Date(createTicketDto.appointment_date);
      startOfDay.setHours(0, 0, 0, 0);  // Establecer al inicio del día (00:00:00)
  
      const endOfDay = new Date(createTicketDto.appointment_date);
      endOfDay.setHours(23, 59, 59, 999); // Establecer al final del día (23:59:59)
      // Verificar si ya existe un ticket en el mismo departamento el mismo día
    const existingTicket = await this.ticketRepository.findOne({
      where: {
        requester_dni:createTicketDto.requester_dni,
        room: {
          department: {
            departmentId: sala.department.departmentId,
          },
        },
        appointment_date: Between(startOfDay, endOfDay),
      },
    });

    if (existingTicket) {
      throw new RpcException({
        message: 'An appointment has already been scheduled in this department for the selected date',
        status: HttpStatus.CONFLICT,
      });
    }
      
      // Crear la entidad Ticket y asignar el Ayuntamiento
      const ticketEntity = this.ticketRepository.create({
        ...createTicketDto,
        cityCouncil: ayuntamiento,
        room: sala,
        employee: tecnico,
      });

      await this.ticketRepository.save(ticketEntity);
      return {message:"Successfully booked appointment"};

    } catch (error) {
        
        throw new RpcException(
           { message:`${error.message}.`,
            status:HttpStatus.INTERNAL_SERVER_ERROR,}
        );
    }

   
  }
   /**
   * Retrieves all tickets with their related entities (city council, room, employee).
   * 
   * @returns A list of all tickets.
   */
  findAll() 
  {
    return this.ticketRepository.find({relations: ['cityCouncil','room','employee']});
  }

  /**
   * Retrieves all active tickets with their related entities.
   * 
   * @returns A list of active tickets.
   */
  async findAllActive() 
  {
    return this.ticketRepository.find({
      where: { isActive: true }, 
      relations:  ['cityCouncil','room','employee'], 
      
    });
  }

  /**
   * Retrieves all inactive tickets with their related entities.
   * 
   * @returns A list of inactive tickets.
   */
  async findAllInactive()
  {
    return this.ticketRepository.find({
      where: { isActive: false }, 
      relations:  ['cityCouncil','room','employee'], 
    });
  }

  /**
   * Retrieves a specific ticket by its ID and its related entities.
   * 
   * @param id_ticket The ID of the ticket to retrieve.
   * @returns The ticket with its related entities, or throws an exception if not found.
   * @throws RpcException if the ticket is not found.
   */
  async findOne(id_ticket: string) 
  {

    const ticket= await this.ticketRepository.findOne({where: {id_ticket },relations: ['cityCouncil','room','employee']  });
    if(!ticket)
    {
      throw new RpcException({message:'Ticket not found.',status:HttpStatus.NOT_FOUND});
    }
      

    return ticket;
  }

  /**
   * Updates an existing ticket with the provided DTO.
   * If the ticket is not found, an exception is thrown.
   * 
   * @param id_ticket The ID of the ticket to update.
   * @param updateTicketDto The DTO containing the updated ticket data.
   * @returns A success message if the update is successful.
   * @throws RpcException if the ticket is not found.
   */
  async update(id_ticket: string, updateTicketDto: UpdateTicketDto)
  {
    const ticket = await this.ticketRepository.preload({
      id_ticket,
      ...updateTicketDto
    });
    if(!ticket)
    {
      throw new RpcException({message:'Ticket not found.',status:HttpStatus.NOT_FOUND});
    }
    this.ticketRepository.save(ticket);
    return {message:"The ticket has been updated successfully."};
  }

  /**
   * Removes (deactivates) a ticket by its ID.
   * If the ticket is already inactive, an exception is thrown.
   * 
   * @param id_ticket The ID of the ticket to deactivate.
   * @returns A success message if the ticket is deactivated.
   * @throws RpcException if the ticket is already inactive.
   */
  async remove(id_ticket: string) 
  {
    const ticket = await this.findOne(id_ticket);

    if(ticket.isActive == false )
    {
      throw new RpcException({message:`The ticket is already deactivated`,statusCode: HttpStatus.CONFLICT});
    } 
    else if (ticket) 
    {
      ticket.isActive = false; 
      await this.ticketRepository.save(ticket); 
    
    } 
   
  
    return {message:"Ticket deactivated successfully."}; 
  }
}
