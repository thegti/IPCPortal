import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EditService {
    member = {};
    private memberSource = new BehaviorSubject(this.member);
    currentMember = this.memberSource.asObservable();
  
    constructor() { }
  
    changeMember(member: any): any {
      this.memberSource.next(member);
    }
}
