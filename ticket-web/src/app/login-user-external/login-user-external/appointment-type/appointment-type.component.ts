import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-type',
  templateUrl: './appointment-type.component.html',
  styleUrl: './appointment-type.component.css'
})
export class AppointmentTypeComponent
{

  constructor(private router:Router){}// Inyección del servicio Router para la navegación
  /**
   * Navega a la ruta de inicio de sesión de citas.
   * Se ejecuta cuando el usuario hace clic en el botón de volver.
   */
  goBack(): void
  {
    this.router.navigate(['/login-appointment'])// Reemplaza '/previous-route' con la ruta a la que quieras volver
  }

  /**
   * Maneja la selección del tipo de cita y redirige a la ruta correspondiente.
   * @param type - El tipo de cita seleccionada ('previa' o 'presencial').
   */
  selectOption(type: string)
  {
    if (type === 'previa') {
      this.router.navigate(['/prior-appointment'])
      // Redirige a la pantalla de cita previa
    } else if (type === 'presencial') {
      console.log('Cita presencial seleccionada');
      // Redirige a la pantalla de cita presencial
    }
  }

}
