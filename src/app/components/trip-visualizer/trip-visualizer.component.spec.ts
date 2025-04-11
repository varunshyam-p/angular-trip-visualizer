import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripVisualizerComponent } from './trip-visualizer.component';

describe('TripVisualizerComponent', () => {
  let component: TripVisualizerComponent;
  let fixture: ComponentFixture<TripVisualizerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripVisualizerComponent]
    });
    fixture = TestBed.createComponent(TripVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
