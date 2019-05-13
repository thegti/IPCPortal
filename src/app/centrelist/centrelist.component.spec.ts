import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrelistComponent } from './centrelist.component';

describe('CentrelistComponent', () => {
  let component: CentrelistComponent;
  let fixture: ComponentFixture<CentrelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentrelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
