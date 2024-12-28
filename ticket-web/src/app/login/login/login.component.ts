import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoginDto } from '../models/login.dto';
import { Router } from '@angular/router';
 // DTO de login

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginDto: LoginDto = {
    dni: '',
    password: '',
  };
  showPassword = false;
  errorMessage: string = ''; // Para mostrar mensajes de error


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
   /**
   * Constructor to inject dependencies.
   * @param authService - AuthService to handle authentication-related logic.
   * @param router - Router to navigate between routes.
   * @param cdr - ChangeDetectorRef to manually trigger change detection if needed.
   */
  constructor(private authService: AuthService, private router: Router,private cdr: ChangeDetectorRef) {}

  /**
   * ngOnInit lifecycle hook to clear localStorage on component initialization.
   */
  ngOnInit(): void {
    localStorage.clear();
  }

   /**
   * Handles the login form submission.
   * Sends the login DTO to the AuthService for authentication.
   */
  onSubmit() {
    this.authService.login(this.loginDto).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.errorMessage = ''; // Limpiar el mensaje de error si el login es exitoso
        if (response.employee && response.employee.rol === 'admin') {
          console.log('Navigating to /admin'); // Verifica si la navegación es llamada
          this.router.navigate(['/admin']);
        } else if (response.employee && (response.employee.rol === 'tec' || response.employee.rol === 'responsable')) {
          console.log('Navigating to /tec'); // Verifica si la navegación es llamada
          this.router.navigate(['/tec']);
        } else if(response.employee && (response.employee.rol === 'super-admin' ))
        {
          this.router.navigate(['/super-admin']);
        }
      },
      error: (err) => {
        console.error('Error during login:', err);
        this.errorMessage = err.error?.message || 'Unexpected error occurred';
      },
    });
  }

}
