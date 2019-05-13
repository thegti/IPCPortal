import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionlistComponent } from './regionlist.component';

describe('RegionlistComponent', () => {
  let component: RegionlistComponent;
  let fixture: ComponentFixture<RegionlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
