import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../login/auth.service';


@Component({
  selector: 'app-tickets-by-room',
  templateUrl: './tickets-by-room.component.html',
  styleUrls: ['./tickets-by-room.component.css'],
})
export class TicketsByRoomComponent implements OnInit
{
  rooms: any[] = [];
  filteredRooms: any[] = [];
  /**
   * Constructor of the TicketsByRoom component
   * @param roomService Service for managing rooms
   * @param router Service for navigating between screens
   * @param authService Service for obtaining information about the responsible department
   */
  constructor(private roomService: RoomService,private router:Router,private authService:AuthService) {}


   /**
   * Method that runs when the component is initialized
   * Loads the rooms from the service and filters them by the responsible department
   */
  ngOnInit(): void
  {
    this.loadRooms();
  }


  /**
   * Loads the active rooms from the service and filters them by department
   * Filters rooms to only show those corresponding to the responsible department
   */
  loadRooms(): void
  {
    const departmentResponsable=this.authService.getDepartmentResponsable();
    this.roomService.fetchRoomsActive().subscribe((data: any[]) => {
      this.rooms = data.filter(room=>room.roomId && room.department &&room.department.departmentId===departmentResponsable);

      this.filteredRooms = [...this.rooms];
    });
  }


   /**
   * Filters the rooms based on the search term
   * @param event Input event for performing the search
   */
  onSearch(event: Event): void
  {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredRooms = this.rooms.filter((room) =>
      `${room.building} ${room.office} ${room.floor}`
        .toLowerCase()
        .includes(searchTerm)
    );
  }
   /**
   * Redirects to the live tickets view for the selected room
   * @param room The selected room to view live tickets
   */
  viewTickets(room: any): void
  {
    this.router.navigate(['/live-ticket-room'], { state: { room } });
  }
   /**
   * Closes the current tab and redirects to the technicians' page
   */
  closeTab(): void
  {
    this.router.navigate(['/tec'])

  }
}
