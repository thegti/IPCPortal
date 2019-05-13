import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberrenewalComponent } from './add-memberrenewal.component';

describe('AddMemberrenewalComponent', () => {
  let component: AddMemberrenewalComponent;
  let fixture: ComponentFixture<AddMemberrenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberrenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberrenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
