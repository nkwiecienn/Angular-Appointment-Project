import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeAvailabilityComponent } from './range-availability.component';

describe('RangeAvailabilityComponent', () => {
  let component: RangeAvailabilityComponent;
  let fixture: ComponentFixture<RangeAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
