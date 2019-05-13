import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchlistComponent } from './churchlist.component';

describe('ChurchlistComponent', () => {
  let component: ChurchlistComponent;
  let fixture: ComponentFixture<ChurchlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChurchlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChurchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
