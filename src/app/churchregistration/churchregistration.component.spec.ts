import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchregistrationComponent } from './churchregistration.component';

describe('ChurchregistrationComponent', () => {
  let component: ChurchregistrationComponent;
  let fixture: ComponentFixture<ChurchregistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChurchregistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChurchregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
