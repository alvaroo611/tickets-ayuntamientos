export class LoginDto
{
  // Property to store the DNI (ID) of the user
  dni: string;

  // Property to store the password of the user
  password: string;
   /**
   * Constructor to initialize the LoginDto object with the provided DNI and password.
   * @param dni - The DNI (ID) of the user.
   * @param password - The password of the user.
   */
  constructor(dni: string, password: string)
  {
    this.dni = dni;
    this.password = password;
  }



}
