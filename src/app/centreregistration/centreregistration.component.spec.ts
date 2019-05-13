import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreregistrationComponent } from './centreregistration.component';

describe('CentreregistrationComponent', () => {
  let component: CentreregistrationComponent;
  let fixture: ComponentFixture<CentreregistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreregistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
