import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberlistingComponent } from './memberlisting.component';

describe('MemberlistingComponent', () => {
  let component: MemberlistingComponent;
  let fixture: ComponentFixture<MemberlistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberlistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
