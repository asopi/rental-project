import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LendingDialogComponent } from './lending-dialog.component';

describe('LendingDialogComponent', () => {
  let component: LendingDialogComponent;
  let fixture: ComponentFixture<LendingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LendingDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LendingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
