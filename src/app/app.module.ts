import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { TripInputComponent } from './components/trip-input/trip-input.component';
import { TripVisualizerComponent } from './components/trip-visualizer/trip-visualizer.component';

@NgModule({
  declarations: [
    AppComponent,
    TripInputComponent,
    TripVisualizerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
