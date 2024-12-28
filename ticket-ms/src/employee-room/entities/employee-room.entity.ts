import { Employee } from "src/auth/entities/auth.entity";
import { Room } from "src/room/entities/sala.entity";

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

/**
 * Represents the association between an employee and a room they are assigned to.
 * 
 * This entity includes the assignment period (start and end dates) and the table assigned 
 * to the employee within a specific room. It also manages the active status of the assignment 
 * and the relationships with the `Employee` and `Room` entities.
 */
@Entity()
export class EmployeeRoom {

  /**
   * Unique identifier for the employee-room assignment (UUID).
   * @type {string}
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The start date of the employee's assignment to the room.
   * @type {Date}
   */
  @Column('date')
  startDate: Date;

  /**
   * The end date of the employee's assignment to the room.
   * @type {Date}
   */
  @Column('date')
  endDate: Date;

  /**
   * The table assigned to the employee in the room.
   * @type {string}
   */
  @Column()
  table: string;

  /**
   * Indicates whether the employee-room assignment is active or inactive.
   * Defaults to `true` when the assignment is created.
   * @type {boolean}
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Many-to-One relationship with `Employee`.
   * Represents the employee assigned to this room.
   * @type {Employee}
   */
  @ManyToOne(() => Employee, (employee) => employee.employeeRooms)
  @JoinColumn()
  employee: Employee;

  /**
   * Many-to-One relationship with `Room`.
   * Represents the room assigned to the employee.
   * @type {Room}
   */
  @ManyToOne(() => Room, (room) => room.employeeRooms)
  @JoinColumn()
  room: Room;
}
