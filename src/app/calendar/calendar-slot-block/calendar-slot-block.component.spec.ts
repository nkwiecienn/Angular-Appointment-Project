import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSlotBlockComponent } from './calendar-slot-block.component';

describe('CalendarSlotBlockComponent', () => {
  let component: CalendarSlotBlockComponent;
  let fixture: ComponentFixture<CalendarSlotBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarSlotBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarSlotBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
