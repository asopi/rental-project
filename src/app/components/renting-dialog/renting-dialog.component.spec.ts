import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentingDialogComponent } from './renting-dialog.component';

describe('RentingDialogComponent', () => {
  let component: RentingDialogComponent;
  let fixture: ComponentFixture<RentingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
