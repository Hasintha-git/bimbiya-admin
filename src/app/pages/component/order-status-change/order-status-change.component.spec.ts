import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusChangeComponent } from './order-status-change.component';

describe('OrderStatusChangeComponent', () => {
  let component: OrderStatusChangeComponent;
  let fixture: ComponentFixture<OrderStatusChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderStatusChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
