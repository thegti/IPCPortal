import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryComponentComponent } from './country-component.component';

describe('CountryComponentComponent', () => {
  let component: CountryComponentComponent;
  let fixture: ComponentFixture<CountryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
