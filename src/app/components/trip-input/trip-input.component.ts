import { Component, Output, EventEmitter } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';

@Component({
  selector: 'app-trip-input',
  templateUrl: './trip-input.component.html',
  styleUrls: ['./trip-input.component.css'],
})
export class TripInputComponent {
  start = '';
  end = '';

  @Output() tripAdded = new EventEmitter<Trip>();

  addTrip() {
    const formattedStart = this.start.trim().toUpperCase().slice(0, 3);
    const formattedEnd = this.end.trim().toUpperCase().slice(0, 3);

    const trip: Trip = {
      start: formattedStart,
      end: formattedEnd,
    };

    this.tripAdded.emit(trip);
    this.start = '';
    this.end = '';
  }
}
