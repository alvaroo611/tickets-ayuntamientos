import { Injectable } from '@angular/core';

/**
 * Service: SharedDataService
 * Purpose: This service is responsible for managing shared data throughout the application,
 *          providing getter and setter methods for various user-related information.
 */

@Injectable({
  providedIn: 'root',
})
export class SharedDataService
{
  // Private properties to store user and department data
  private department: any;
  private dni: string = '';
  private nombre: string = '';
  private telefono: string = '';
  private ayuntamiento: string = '';

  /**
   * Sets the department information.
   *
   * @param department - The department data to be stored.
   */
  setDepartment(department: any): void
  {
    this.department = department;
  }

  /**
   * Gets the stored department information.
   *
   * @returns The department data.
   */
  getDepartment(): any
  {
    return this.department;
  }

  /**
   * Sets the user's DNI (identification number).
   *
   * @param dni - The DNI to be stored.
   */
  setDni(dni: string): void {
    this.dni = dni;
  }

  /**
   * Gets the stored user's DNI.
   *
   * @returns The user's DNI.
   */
  getDni(): string {
    return this.dni;
  }

  /**
   * Sets the user's name.
   *
   * @param nombre - The name of the user to be stored.
   */
  setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  /**
   * Gets the stored user's name.
   *
   * @returns The user's name.
   */
  getNombre(): string {
    return this.nombre;
  }

  /**
   * Sets the user's phone number.
   *
   * @param telefono - The phone number to be stored.
   */
  setTelefono(telefono: string): void {
    this.telefono = telefono;
  }

  /**
   * Gets the stored user's phone number.
   *
   * @returns The user's phone number.
   */
  getTelefono(): string {
    return this.telefono;
  }

  /**
   * Sets the city hall (ayuntamiento) information.
   *
   * @param ayuntamiento - The city hall data to be stored.
   */
  setAyuntamiento(ayuntamiento: string): void {
    this.ayuntamiento = ayuntamiento;
  }

  /**
   * Gets the stored city hall information.
   *
   * @returns The city hall data.
   */
  getAyuntamiento(): string {
    return this.ayuntamiento;
  }
}
