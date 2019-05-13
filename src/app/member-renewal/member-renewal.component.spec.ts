import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRenewalComponent } from './member-renewal.component';

describe('MemberRenewalComponent', () => {
  let component: MemberRenewalComponent;
  let fixture: ComponentFixture<MemberRenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberRenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
