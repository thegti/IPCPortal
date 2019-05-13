import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrntMemberComponent } from './prnt-member.component';

describe('PrntMemberComponent', () => {
  let component: PrntMemberComponent;
  let fixture: ComponentFixture<PrntMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrntMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrntMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
