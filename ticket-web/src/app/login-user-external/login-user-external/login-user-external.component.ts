import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';
import { CityCouncilService } from '../../dashboard/services/city-council..service';


@Component({
  selector: 'app-login-user-external',
  templateUrl: './login-user-external.component.html',
  styleUrls: ['./login-user-external.component.css']
})
export class LoginUserExternalComponent implements OnInit
{
  dni: string = '';
  nombre: string = '';
  telefono: string = '';
  ayuntamiento: string = '';
  ayuntamientos: { id: string; name: string }[] = [];
  showPlaceholder: boolean = true;

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private cityCouncilService: CityCouncilService
  ) {}


  /**
   * Lifecycle method executed when the component initializes.
   * Loads the list of active city councils.
   */
  ngOnInit(): void
  {
    this.fetchAyuntamientos();

  }

  /**
   * Fetches the list of active city councils from the service.
   */
  fetchAyuntamientos(): void
  {
    this.cityCouncilService.fetchCityCouncilActive().subscribe(
      (data) => {
        this.ayuntamientos = data.map((council) => ({
          id: council.id,
          name: council.name
        }));

      },
      (error) => {
        console.error('Error al cargar los ayuntamientos:', error);
      }
    );
  }

  /**
   * Toggles the placeholder visibility based on user input.
   * @param show - Indicates whether to show or hide the placeholder.
   */
  togglePlaceholder(show: boolean): void
  {
    this.showPlaceholder = show;
  }

  /**
   * Sends the entered data to the shared service and navigates to the appointment type page.
   */
  onSubmit(): void
  {
    this.sharedDataService.setDni(this.dni);
    this.sharedDataService.setNombre(this.nombre);
    this.sharedDataService.setTelefono(this.telefono);
    this.sharedDataService.setAyuntamiento(this.ayuntamiento);

    this.router.navigate(['/type-cita']);
  }
}
