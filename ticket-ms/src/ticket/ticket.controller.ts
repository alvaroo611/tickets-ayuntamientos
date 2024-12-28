import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

/**
 * Controller for managing tickets.
 * This controller handles messages related to ticket management, delegating business logic to the `TicketService`.
 */
@Controller()
export class TicketController 
{
  /**
   * Constructor of the controller.
   * Injects the `TicketService` to delegate the business logic for ticket operations.
   * 
   * @param ticketService The service to handle ticket-related business logic.
   */
  constructor(private readonly ticketService: TicketService) {}


   /**
   * Handles the message to create a new ticket.
   * 
   * @param createTicketDto The DTO containing the data to create a new ticket.
   * @returns The result of the ticket creation, delegated to the `create` service method.
   */
  @MessagePattern('createTicket')
  create(@Payload() createTicketDto: CreateTicketDto) 
  {

    const dto: CreateTicketDto = {
      ...createTicketDto,
      appointment_date: new Date(createTicketDto.appointment_date),
      attended_date: new Date(createTicketDto.attended_date),
      creation_date:new Date(createTicketDto.creation_date),
      completion_date:new Date(createTicketDto.completion_date),
      

    }
    return this.ticketService.create(dto);
  }

  /**
   * Handles the message to retrieve all tickets.
   * 
   * @returns A list of all tickets, delegated to the `findAll` service method.
   */
  @MessagePattern('findAllTicket')
  findAll() 
  {
    return this.ticketService.findAll();
  }

  /**
   * Handles the message to retrieve all active tickets.
   * 
   * @returns A list of active tickets, delegated to the `findAllActive` service method.
   */
  @MessagePattern('findAllActiveTicket')
  findAllActive() 
  {
    
    return this.ticketService.findAllActive();
  }

  /**
   * Handles the message to retrieve all inactive tickets.
   * 
   * @returns A list of inactive tickets, delegated to the `findAllInactive` service method.
   */
  @MessagePattern('findAllInactiveTicket')
  findAllInactive() 
  {
    
    return this.ticketService.findAllInactive();
  }

  /**
   * Handles the message to retrieve a specific ticket by its ID.
   * 
   * @param id_ticket The ID of the ticket to retrieve.
   * @returns The ticket corresponding to the ID, delegated to the `findOne` service method.
   */
  @MessagePattern('findOneTicket')
  findOne(@Payload() id_ticket: string) 
  {
    return this.ticketService.findOne(id_ticket);
  }

  /**
   * Handles the message to update an existing ticket.
   * 
   * @param updateTicketDto The DTO containing the data to update the ticket.
   * @returns The result of the update, delegated to the `update` service method.
   */
  @MessagePattern('updateTicket')
  update(@Payload() updateTicketDto: UpdateTicketDto) 
  {
    return this.ticketService.update(updateTicketDto.id, updateTicketDto);
  }

  /**
   * Handles the message to remove a ticket by its ID.
   * 
   * @param id_ticket The ID of the ticket to remove.
   * @returns The result of the removal, delegated to the `remove` service method.
   */
  @MessagePattern('removeTicket')
  remove(@Payload() id_ticket: string) 
  {
    return this.ticketService.remove(id_ticket);
  }
}
