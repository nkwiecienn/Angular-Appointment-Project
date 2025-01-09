import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityHomeComponent } from './availability-home.component';

describe('AvailabilityHomeComponent', () => {
  let component: AvailabilityHomeComponent;
  let fixture: ComponentFixture<AvailabilityHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
