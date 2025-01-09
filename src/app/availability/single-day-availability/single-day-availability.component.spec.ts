import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDayAvailabilityComponent } from './single-day-availability.component';

describe('SingleDayAvailabilityComponent', () => {
  let component: SingleDayAvailabilityComponent;
  let fixture: ComponentFixture<SingleDayAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleDayAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleDayAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
