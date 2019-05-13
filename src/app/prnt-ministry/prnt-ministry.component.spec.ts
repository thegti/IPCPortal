import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrntMinistryComponent } from './prnt-ministry.component';

describe('PrntMinistryComponent', () => {
  let component: PrntMinistryComponent;
  let fixture: ComponentFixture<PrntMinistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrntMinistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrntMinistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
