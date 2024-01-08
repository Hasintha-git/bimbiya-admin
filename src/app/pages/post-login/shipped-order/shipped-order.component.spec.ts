import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippedOrderComponent } from './shipped-order.component';

describe('ShippedOrderComponent', () => {
  let component: ShippedOrderComponent;
  let fixture: ComponentFixture<ShippedOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippedOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
