import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRgnlistComponent } from './print-rgnlist.component';

describe('PrintRgnlistComponent', () => {
  let component: PrintRgnlistComponent;
  let fixture: ComponentFixture<PrintRgnlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintRgnlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRgnlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
