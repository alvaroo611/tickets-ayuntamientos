import { Employee } from "src/auth/entities/auth.entity";
import { Department } from "src/department/entities/department.entity";
import { EmployeeRoom } from "src/employee-room/entities/employee-room.entity";

import { Ticket } from "src/ticket/entities/ticket.entity";
import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

/**
 * Represents a room within a building that is associated with a department.
 * 
 * This entity includes the details of the room, such as its building, office number, floor, and the 
 * number of staff assigned. It also manages the active status of the room and its relationships with 
 * the `Department`, `Ticket`, and `EmployeeRoom` entities.
 */
@Entity()
export class Room 
{

  /**
   * Unique identifier for the room (UUID).
   * @type {string}
   */
  @PrimaryGeneratedColumn("uuid")
  roomId: string;

  /**
   * The building where the room is located.
   * @type {string}
   */
  @Column()
  building: string;

  /**
   * The office number within the building.
   * @type {number}
   */
  @Column()
  office: number;

  /**
   * The floor on which the room is located.
   * @type {number}
   */
  @Column()
  floor: number;

  /**
   * The number of staff assigned to this room.
   * @type {number}
   */
  @Column()
  staffNumber: number;

  /**
   * Indicates whether the room is active or inactive.
   * Defaults to `true` when the room is created.
   * @type {boolean}
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Many-to-One relationship with `Department`.
   * Represents the department that the room belongs to.
   * @type {Department}
   */
  @ManyToOne(() => Department, (department) => department.roomEntities)
  @JoinColumn()
  department: Department;

  /**
   * One-to-Many relationship with `Ticket`.
   * Represents the tickets associated with the room.
   * @type {Ticket[]}
   */
  @OneToMany(() => Ticket, (ticket) => ticket.room)
  tickets: Ticket[];

  /**
   * One-to-Many relationship with `EmployeeRoom`.
   * Represents the employees assigned to this room.
   * @type {EmployeeRoom[]}
   */
  @OneToMany(() => EmployeeRoom, (employeeRooms) => employeeRooms.room)
  employeeRooms: EmployeeRoom[];
}
