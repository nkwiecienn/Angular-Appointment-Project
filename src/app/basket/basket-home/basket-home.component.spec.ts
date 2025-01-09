import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketHomeComponent } from './basket-home.component';

describe('BasketHomeComponent', () => {
  let component: BasketHomeComponent;
  let fixture: ComponentFixture<BasketHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasketHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
