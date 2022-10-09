import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdenticonComponent } from './identicon.component';

describe('IdenticonComponent', () => {
  let component: IdenticonComponent;
  let fixture: ComponentFixture<IdenticonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdenticonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdenticonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
