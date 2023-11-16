import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodcityManagementComponent } from './foodcity-management.component';

describe('FoodcityManagementComponent', () => {
  let component: FoodcityManagementComponent;
  let fixture: ComponentFixture<FoodcityManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodcityManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodcityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
