import { Employee } from "src/auth/entities/auth.entity";
import { CityCouncil } from "src/city-council/entities/city-council.entity";
import { Room } from "src/room/entities/sala.entity";

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

/**
 * Represents a ticket within the system, which is created by a requester and handled by an employee.
 * 
 * This entity includes details about the ticket, such as the requester's information, the department, 
 * the status of the ticket, and associated timestamps. It also manages the relationships with other entities, 
 * including `Room`, `Employee`, and `CityCouncil`.
 */
@Entity()
export class Ticket 
{

  /**
   * Unique identifier for the ticket (UUID).
   * @type {string}
   */
  @PrimaryGeneratedColumn("uuid")
  id_ticket: string;

  /**
   * The DNI of the requester who created the ticket.
   * @type {string}
   */
  @Column()
  requester_dni: string;

  /**
   * Additional notes or comments related to the ticket.
   * @type {string}
   */
  @Column()
  notes: string;

  /**
   * The current status of the ticket (e.g., `en_cumplimiento`, `en_progreso`, `finalizado`).
   * @type {string}
   */
  @Column()
  status: string;

  /**
   * The date and time when the appointment for the ticket is scheduled.
   * @type {Date}
   */
  @Column()
  appointment_date: Date;

  /**
   * The date and time when the ticket was created.
   * Defaults to the current timestamp when the ticket is created.
   * @type {Date}
   */
  @Column({ default: () => "CURRENT_TIMESTAMP" })
  creation_date: Date;

  /**
   * The date and time when the ticket was attended to.
   * This field is nullable, as it may not be set immediately.
   * @type {Date | null}
   */
  @Column({ nullable: true })
  attended_date: Date;

  /**
   * The date and time when the ticket was completed.
   * This field is nullable, as it may not be set immediately.
   * @type {Date | null}
   */
  @Column({ nullable: true })
  completion_date: Date;

  /**
   * The name of the department handling the ticket.
   * @type {string}
   */
  @Column()
  department_name: string;

  /**
   * The name of the external user associated with the ticket.
   * @type {string}
   */
  @Column()
  external_user_name: string;

  /**
   * The phone number associated with the ticket.
   * @type {number}
   */
  @Column()
  phone: number;

  /**
   * Indicates whether the ticket is active or not.
   * Defaults to `true` when the ticket is created.
   * @type {boolean}
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Many-to-One relationship with `Room`.
   * Represents the room associated with the ticket.
   * @type {Room}
   */
  @ManyToOne(() => Room, (room) => room.tickets)
  @JoinColumn()
  room: Room;

  /**
   * Many-to-One relationship with `Employee`.
   * Represents the employee who is handling the ticket.
   * @type {Employee}
   */
  @ManyToOne(() => Employee, (employee) => employee.tickets)
  @JoinColumn()
  employee: Employee;

  /**
   * Many-to-One relationship with `CityCouncil`.
   * Represents the city council associated with the ticket.
   * @type {CityCouncil}
   */
  @ManyToOne(() => CityCouncil, (cityCouncil) => cityCouncil.tickets)
  @JoinColumn()
  cityCouncil: CityCouncil;
}
