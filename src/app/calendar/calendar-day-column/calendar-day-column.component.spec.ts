import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDayColumnComponent } from './calendar-day-column.component';

describe('CalendarDayColumnComponent', () => {
  let component: CalendarDayColumnComponent;
  let fixture: ComponentFixture<CalendarDayColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDayColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarDayColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
