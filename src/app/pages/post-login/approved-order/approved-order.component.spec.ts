import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedOrderComponent } from './approved-order.component';

describe('ApprovedOrderComponent', () => {
  let component: ApprovedOrderComponent;
  let fixture: ComponentFixture<ApprovedOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
