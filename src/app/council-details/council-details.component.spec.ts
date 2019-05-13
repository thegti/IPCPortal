import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouncilDetailsComponent } from './council-details.component';

describe('CouncilDetailsComponent', () => {
  let component: CouncilDetailsComponent;
  let fixture: ComponentFixture<CouncilDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouncilDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouncilDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
