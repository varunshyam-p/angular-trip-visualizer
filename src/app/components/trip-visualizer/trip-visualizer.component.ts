import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-visualizer',
  templateUrl: './trip-visualizer.component.html',
  styleUrls: ['./trip-visualizer.component.css']
})
export class TripVisualizerComponent implements OnInit, OnChanges {
  @Input() trips: Trip[] = [];

  svgWidth: number = 0;
  readonly TRIP_SPACING = 150;
  readonly MARGIN = 50;
  readonly LEVEL1_Y = 40;
  readonly LEVEL2_Y = 10;

  ngOnInit() {
    this.updateSvgWidth();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trips'] && changes['trips'].currentValue) {
      this.updateSvgWidth();
    }
  }

  private updateSvgWidth(): void {
    const tripCount = this.trips?.length || 0;
    // Ensure the width grows dynamically based on the number of trips
    const dynamicWidth = (tripCount * this.TRIP_SPACING) + (2 * this.MARGIN);
    this.svgWidth = Math.max(dynamicWidth, 1500); // Prevent shrinking below 1500px, but let it grow
  }
  
  
  

  getTripType(index: number): 'continued' | 'non-continued' | 'repeated' {
    if (index >= this.trips.length - 1) return 'continued';
    const current = this.trips[index];
    const next = this.trips[index + 1];
    if (current.start === next.start && current.end === next.end) return 'repeated';
    if (current.end === next.start) return 'continued';
    return 'non-continued';
  }

  isRepeatedTrip(index: number): boolean {
    return this.getTripType(index) === 'repeated';
  }

  isTransitionToRepeated(index: number): boolean {
    return this.getTripType(index + 1) === 'repeated' && this.getTripType(index) !== 'repeated';
  }

  isTransitionFromRepeated(index: number): boolean {
    if (!this.isValidIndex(index)) return false;
  
    const isCurrentRepeated = this.getTripType(index) === 'repeated';
    const isAtLevel2 = this.getCircleY(index) === this.LEVEL2_Y;
  
    const isLastInRepeatedSequence =
      index === this.trips.length - 1 ||
      this.getTripType(index + 1) !== 'repeated';
  
    const nextIsAtLevel1 =
      index === this.trips.length - 1 ||
      this.getCircleY(index + 1) === this.LEVEL1_Y;
  
    return isCurrentRepeated && isAtLevel2 && isLastInRepeatedSequence && nextIsAtLevel1;
  }
  
  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.trips.length;
  }
  

  generateCurveUp(index: number): string {
    const x1 = index * this.TRIP_SPACING + this.MARGIN;
    const x2 = (index + 1) * this.TRIP_SPACING + this.MARGIN;
    const cx1 = x1 + 50;
    const cx2 = x2 - 50;
    return `M ${x1} ${this.LEVEL1_Y} C ${cx1} ${this.LEVEL1_Y}, ${cx2} ${this.LEVEL2_Y}, ${x2} ${this.LEVEL2_Y}`;
  }

  generateCurveDown(index: number): string {
    const x1 = index * this.TRIP_SPACING + this.MARGIN;
    const x2 = (index + 1) * this.TRIP_SPACING + this.MARGIN;
    const cx1 = x1 + 50;
    const cx2 = x2 - 50;
    return `M ${x1} ${this.LEVEL2_Y} C ${cx1} ${this.LEVEL2_Y}, ${cx2} ${this.LEVEL1_Y}, ${x2} ${this.LEVEL1_Y}`;
  }

  generateRepeatedLine(index: number): string {
    const x1 = index * this.TRIP_SPACING + this.MARGIN;
    const x2 = (index + 1) * this.TRIP_SPACING + this.MARGIN;
    return `M ${x1} ${this.LEVEL2_Y} L ${x2} ${this.LEVEL2_Y}`;
  }

  getCircleY(index: number): number {
    if (
      this.getTripType(index) === 'repeated' ||
      (index > 0 && this.getTripType(index - 1) === 'repeated')
    ) {
      return this.LEVEL2_Y;
    }
    return this.LEVEL1_Y;
  }

  getLineY(index: number): number {
    return this.LEVEL1_Y;
  }

  getCircleColor(index: number): string {
    const type = this.getTripType(index);
    if (type === 'repeated') return '#666666';
    if (type === 'continued') return '#4B5EAA';
    return '#FFA500';
  }
}
