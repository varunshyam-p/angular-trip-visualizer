import { Component, Output, EventEmitter } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';

@Component({
  selector: 'app-trip-input',
  templateUrl: './trip-input.component.html',
  styleUrls: ['./trip-input.component.css'],
})
export class TripInputComponent {
  start = ''; // Stores the start point input value
  end = '';   // Stores the end point input value

  @Output() tripAdded = new EventEmitter<Trip>(); // Emits trip data to parent component

  /**
   * Formats and emits a new trip when the form is submitted.
   * - Trims and converts inputs to uppercase (first 3 chars).
   * - Emits the trip via `tripAdded` event.
   * - Resets input fields.
   */
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
