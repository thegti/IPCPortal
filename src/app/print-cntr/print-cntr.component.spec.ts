import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCntrComponent } from './print-cntr.component';

describe('PrintCntrComponent', () => {
  let component: PrintCntrComponent;
  let fixture: ComponentFixture<PrintCntrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCntrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCntrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
