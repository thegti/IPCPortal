import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintChurchComponent } from './print-church.component';

describe('PrintChurchComponent', () => {
  let component: PrintChurchComponent;
  let fixture: ComponentFixture<PrintChurchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintChurchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintChurchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
