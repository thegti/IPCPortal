import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouncilMembersComponent } from './council-members.component';

describe('CouncilMembersComponent', () => {
  let component: CouncilMembersComponent;
  let fixture: ComponentFixture<CouncilMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouncilMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouncilMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
