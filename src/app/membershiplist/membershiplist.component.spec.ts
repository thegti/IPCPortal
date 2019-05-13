import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershiplistComponent } from './membershiplist.component';

describe('MembershiplistComponent', () => {
  let component: MembershiplistComponent;
  let fixture: ComponentFixture<MembershiplistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershiplistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershiplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
