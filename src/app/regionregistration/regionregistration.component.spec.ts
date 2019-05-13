import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionregistrationComponent } from './regionregistration.component';

describe('RegionregistrationComponent', () => {
  let component: RegionregistrationComponent;
  let fixture: ComponentFixture<RegionregistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionregistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
