import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-visualizer',
  templateUrl: './trip-visualizer.component.html',
  styleUrls: ['./trip-visualizer.component.css']
})
export class TripVisualizerComponent implements OnInit, OnChanges {
  @Input() trips: Trip[] = []; // Input array of trips to visualize

  svgWidth: number = 0;          // Dynamic width of the SVG container
  readonly TRIP_SPACING = 150;   // Horizontal space between trip nodes
  readonly MARGIN = 50;           // Left/right margin for SVG
  readonly LEVEL1_Y = 40;         // Y-coordinate for primary trip line
  readonly LEVEL2_Y = 10;         // Y-coordinate for repeated trips line

  /**
   * Initializes SVG width on component load.
   */
  ngOnInit() {
    this.updateSvgWidth();
  }

  /**
   * Updates SVG width when trips input changes.
   * @param changes - Angular SimpleChanges object for input tracking.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['trips'] && changes['trips'].currentValue) {
      this.updateSvgWidth();
    }
  }

  /**
   * Dynamically adjusts SVG width based on trip count.
   * Ensures width never shrinks below 1500px.
   */
  private updateSvgWidth(): void {
    const tripCount = this.trips?.length || 0;
    const dynamicWidth = (tripCount * this.TRIP_SPACING) + (2 * this.MARGIN);
    this.svgWidth = Math.max(dynamicWidth, 1500);
  }

  /**
   * Determines the type of trip at a given index.
   * @param index - Position in the trips array.
   * @returns 'continued' | 'non-continued' | 'repeated' - Trip classification.
   */
  getTripType(index: number): 'continued' | 'non-continued' | 'repeated' {
    if (index >= this.trips.length - 1) return 'continued';
    const current = this.trips[index];
    const next = this.trips[index + 1];
    if (current.start === next.start && current.end === next.end) return 'repeated';
    if (current.end === next.start) return 'continued';
    return 'non-continued';
  }

  /**
   * Checks if the trip at the index is a repeated trip.
   * @param index - Position in the trips array.
   */
  isRepeatedTrip(index: number): boolean {
    return this.getTripType(index) === 'repeated';
  }

  /**
   * Checks if the current trip transitions to a repeated sequence.
   * @param index - Position in the trips array.
   */
  isTransitionToRepeated(index: number): boolean {
    return this.getTripType(index + 1) === 'repeated' && this.getTripType(index) !== 'repeated';
  }

  /**
   * Checks if the current trip transitions back from a repeated sequence.
   * @param index - Position in the trips array.
   */
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

  /**
   * Validates if an index is within the trips array bounds.
   * @param index - Position to validate.
   */
  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.trips.length;
  }

  /**
   * Generates an upward curve SVG path for transitions to repeated trips.
   * @param index - Starting trip index for the curve.
   */
  generateCurveUp(index: number): string {
    const x1 = index * this.TRIP_SPACING + this.MARGIN;
    const x2 = (index + 1) * this.TRIP_SPACING + this.MARGIN;
    const cx1 = x1 + 50;
    const cx2 = x2 - 50;
    return `M ${x1} ${this.LEVEL1_Y} C ${cx1} ${this.LEVEL1_Y}, ${cx2} ${this.LEVEL2_Y}, ${x2} ${this.LEVEL2_Y}`;
  }

  /**
   * Generates a downward curve SVG path for transitions from repeated trips.
   * @param index - Starting trip index for the curve.
   */
  generateCurveDown(index: number): string {
    const x1 = index * this.TRIP_SPACING + this.MARGIN;
    const x2 = (index + 1) * this.TRIP_SPACING + this.MARGIN;
    const cx1 = x1 + 50;
    const cx2 = x2 - 50;
    return `M ${x1} ${this.LEVEL2_Y} C ${cx1} ${this.LEVEL2_Y}, ${cx2} ${this.LEVEL1_Y}, ${x2} ${this.LEVEL1_Y}`;
  }

  /**
   * Generates a dashed line SVG path for repeated trips.
   * @param index - Starting trip index for the line.
   */
  generateRepeatedLine(index: number): string {
    const x1 = index * this.TRIP_SPACING + this.MARGIN;
    const x2 = (index + 1) * this.TRIP_SPACING + this.MARGIN;
    return `M ${x1} ${this.LEVEL2_Y} L ${x2} ${this.LEVEL2_Y}`;
  }

  /**
   * Returns the Y-coordinate for a trip's circle based on its type.
   * @param index - Position in the trips array.
   */
  getCircleY(index: number): number {
    if (
      this.getTripType(index) === 'repeated' ||
      (index > 0 && this.getTripType(index - 1) === 'repeated')
    ) {
      return this.LEVEL2_Y;
    }
    return this.LEVEL1_Y;
  }

  /**
   * Returns the Y-coordinate for a trip's connecting line (unused in template).
   * @param index - Position in the trips array.
   */
  getLineY(index: number): number {
    return this.LEVEL1_Y;
  }

  /**
   * Determines the circle color based on trip type.
   * @param index - Position in the trips array.
   */
  getCircleColor(index: number): string {
    const type = this.getTripType(index);
    if (type === 'repeated') return '#666666';
    if (type === 'continued') return '#4B5EAA';
    return '#FFA500';
  }
}