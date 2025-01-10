import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketReservationsComponent } from './basket-reservations.component';

describe('BasketReservationsComponent', () => {
  let component: BasketReservationsComponent;
  let fixture: ComponentFixture<BasketReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasketReservationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
