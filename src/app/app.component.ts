import { Component } from '@angular/core';
import { Trip } from './models/trip.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  trips: Trip[] = [];

  addTrip(trip: Trip) {
    this.trips.push(trip);
  }
}
