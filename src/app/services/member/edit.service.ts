import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EditService {
    member = {
        'foredit': false,
        'MMM_AADHR_SSN_NO':  '',
        'MMM_ADDR1': '',
        'MMM_TITLE': '',
        'MMM_ADDR2': '',
        'MMM_BLOOD_GROUP':  '',
        'MMM_CENTER': '',
        'MMM_CHURCH': '',
        'MMM_CITY': '',
        'MMM_COUNTRY': '',
       // "MMM_COUNTRY1": "1",
        'MMM_DOB': '',
        'MMM_EMAIL': '',
        'MMM_ENROLL_DATE': '',
        'MMM_EXPIRY_DATE': '',
        'MMM_FATHER_NAME': '',
        'MMM_GENDER': 0,
        'MMM_MARITAL_STATUS': 0,
        'MMM_MOBIL': '',
        'MMM_MOTHER_NAME': '',
        'MMM_NAME1': '',
        'MMM_NAME2': '',
        'MMM_NAME3': '',
        'MMM_NO_OF_CHILDREN': 0,
         'MMM_PHOTO':  '',
        'MMM_PROFESSION': '',
        'MMM_REGION': '',
        'MMM_SPOUSE_NAME': '',
        'MMM_STATE': '',
        'MMM_MEMBER': 1,
         'MMM_ACTIVE': 1,
        'LAST_MOD_DT': ''
        };
        user = {
            'USR_NAME': '',
            'USR_PASSWORD': '',
            'USR_EMAIL':  '',
            'USR_ACTIVE':  0,
            'USER_PK': 0,
            'USR_LAST_LOGIN_SUCC': '',
            'USR_LAST_LOGIN_FAIL': '',
            'LAST_MOD_DT': ''

        };
        renewView = {};
        memberrenewlist: Array<object> = [];
    private memberSource = new BehaviorSubject(this.member);
    currentMember = this.memberSource.asObservable();
    private userSource = new BehaviorSubject(this.user);
    currentUser = this.userSource.asObservable();
    private memberRenewSource = new BehaviorSubject(this.memberrenewlist);
    currentRenewList = this.memberRenewSource.asObservable();
    private RenewViewSource = new BehaviorSubject(this.renewView);
    currentRenewView = this.RenewViewSource.asObservable();
    constructor() { }
  
    changeMember(member: any): void {
      this.memberSource.next(member);
    }
    changeUser(user: any): void {
        this.userSource.next(user);
      }
      changeRenewList(list: Array<object>): void {
        this.memberRenewSource.next(list); 
      }
    changerenewViewData(viewData: any): void {
        this.RenewViewSource.next(viewData);
    }
}
