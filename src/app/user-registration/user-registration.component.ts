import { Component, OnInit , OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ApiService } from '../services/common/common.service';
import {AuthService} from '../authentication/auth.service';
import { MemberService } from '../services/member/member.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { EditService } from '../services/member/edit.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {GlobalUrl} from '../utility/GlobalUrl';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {Type} from '../utility/type';
import {UserSavReqModel} from '../business-object/userbo';
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss',  '../scss/form.scss', '../scss/settingbutton.scss']
})
export class UserRegistrationComponent implements OnInit {
    horizontalStepperStep1: FormGroup;
    members: Array<Object> = [{
      'MMM_NAME_TEXT': 'Search',
      'MMM_NAME1': 'Search',
      'MMM_NAME2': 'Member',
      'MMM_NAME3': '',
      'MMM_PK': 0
  
   }];
   searchDataNull = {
    'MMM_NAME_TEXT': '--Select--',
      'MMM_NAME1': '',
      'MMM_NAME2': '',
      'MMM_NAME3': '',
      'MMM_PK': 0

   };
    currentUser: any;
    registerid: any;
    saveReq: UserSavReqModel;
    enableclose: Boolean = false;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    confirmDialogRef: MatDialogRef<DialogComponent>;
   public memberFilterCtrl: FormControl = new FormControl();
 
   public filteredMember: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);

   constructor(
                 private authService: AuthService,
                 private _formBuilder: FormBuilder,
                 private apiService: ApiService,
                 private memberService: MemberService,
                 private editService: EditService,
                 private _fuseSidebarService: FuseSidebarService,
                 private router: Router,
                 private act_route: ActivatedRoute,
                 public _matDialog: MatDialog,
                 private httpClient: HttpClient,
                 private GlobalUrls: GlobalUrl
               ) { }
   
     ngOnInit(): void {
 
        this.editService.currentUser.subscribe(message => {
            this.currentUser = message;
            console.log(this.currentUser);
            this.act_route.params.subscribe(params => {
      
 
                console.log( this.currentUser);
                  this.registerid = params['id'];
        
                 if (this.registerid == Type.userEdit) {
                     if (this.currentUser['USR_ACTIVE'] == 1){
                        this.currentUser['USR_ACTIVE'] = true;
                     }else {
                        this.currentUser['USR_ACTIVE'] = false;
                     }
                    this.horizontalStepperStep1 = this._formBuilder.group({
                      
                        username: [ this.currentUser['USR_NAME'], Validators.required],
                        password: [ this.currentUser['USR_PASSWORD'],  [Validators.required, Validators.minLength(6)]],
                        confirm: [this.currentUser['USR_PASSWORD']],
                        active: [  this.currentUser['USR_ACTIVE']],
                        email: [  this.currentUser['USR_EMAIL'],  Validators.email],
                        member: [ this.currentUser['USR_MEMBER']]
                      
                      });
                 }else if (this.registerid == Type.userView) {
                    this.enableclose = true;
                    if (this.currentUser['USR_ACTIVE'] == 1){
                        this.currentUser['USR_ACTIVE'] = true;
                     }else {
                        this.currentUser['USR_ACTIVE'] = false;
                     }
                    this.horizontalStepperStep1 = this._formBuilder.group({
                        username: [ this.currentUser['USR_NAME'], Validators.required],
                        password: [ this.currentUser['USR_PASSWORD'],  [Validators.required, Validators.minLength(6)]],
                        confirm: [this.currentUser['USR_PASSWORD']],
                        active: [  this.currentUser['USR_ACTIVE']],
                        email: [  this.currentUser['USR_EMAIL'],  Validators.email],
                        member: [ this.currentUser['USR_MEMBER']]
                      
                      });
                      this.horizontalStepperStep1.disable();
                 }else{
                     
                     this.horizontalStepperStep1 = this._formBuilder.group({
                         username: ['', Validators.required],
                         password: ['',  [Validators.required, Validators.minLength(6)]],
                         confirm: [''],
                         active: [''],
                         email: ['',  Validators.email],
                        member: ['']
              
                    });
                 }
            });   
            this.getMembers();
            this.memberFilterCtrl.valueChanges
            .subscribe(() => {
              this.filterMember();
            });
        });   
   }   
   getMembers(): any {
    this.filteredMember.next(this.members.slice());
//     this.memberService.getMember().subscribe((data: Array<object>) => {
//         this.members = data['Data'];
        
//        this.filteredMember.next(this.members.slice());
//   });
  }
  private filterMember(): void{
  
    let search = this.memberFilterCtrl.value;
    if (!search) {
   
     this.filteredMember.next(this.members.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    const reqbody = {
        'USER_PK': 1,
        'AUTO_SEARCH': search
     };
     this.memberService.getMemberAuto(reqbody, this.header).subscribe(members => {
         this.members = members['Data'];
         this.members.splice(0,0,this.searchDataNull);
         this.filteredMember.next(this.members);
     });
 
  
}
  register(): void{
    //   console.log(this.horizontalStepperStep1.value);
      if (this.horizontalStepperStep1.value.password != this.horizontalStepperStep1.value.confirm){
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });

            this.confirmDialogRef.componentInstance.Message = "Passwords Doesn't Match";
      }else{
          if (this.horizontalStepperStep1.value.active === true){
            this.horizontalStepperStep1.value.active = 1;
          }else{
            this.horizontalStepperStep1.value.active = 0;
          }
          if(this.registerid == Type.userEdit){
            this.saveReq = {
                'USR_PK': this.currentUser['USR_PK'],
                'USR_NAME': this.horizontalStepperStep1.value.username,
                'USR_PASSWORD': this.horizontalStepperStep1.value.password,
                'USR_EMAIL':  this.horizontalStepperStep1.value.email,
                'USR_MEMBER':  this.horizontalStepperStep1.value.member,
                'USR_ACTIVE':  this.horizontalStepperStep1.value.active,
                'USER_PK': 1,
                // 'USR_LAST_LOGIN_SUCC': '',
                // 'USR_LAST_LOGIN_FAIL': '',
                // 'USR_LAST_LOGIN_SUCC': new Date().toISOString(),
                // 'USR_LAST_LOGIN_FAIL': new Date().toISOString(),
                'LAST_MOD_DT': this.currentUser['LAST_MOD_DT']
            }; 
            
     
          }else{
            this.saveReq = {
                'USR_PK': 0,
                'USR_NAME': this.horizontalStepperStep1.value.username,
                'USR_PASSWORD': this.horizontalStepperStep1.value.password,
                'USR_EMAIL':  this.horizontalStepperStep1.value.email,
                'USR_MEMBER':  this.horizontalStepperStep1.value.member,
                'USR_ACTIVE':  this.horizontalStepperStep1.value.active,
                'USER_PK': 1,
                // 'USR_LAST_LOGIN_SUCC': '',
                // 'USR_LAST_LOGIN_FAIL': '',
                // 'USR_LAST_LOGIN_SUCC': new Date().toISOString(),
                // 'USR_LAST_LOGIN_FAIL': new Date().toISOString(),
                'LAST_MOD_DT': new Date()
            };
          }
          console.log('json');
          console.log(this.saveReq);
          this.header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
          this.memberService.saveUser(this.saveReq, this.header).subscribe((data) => {
              console.log(data);
              if (data['Data'] > 0) {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
                 if (this.registerid == Type.userEdit){
                    this.confirmDialogRef.componentInstance.Message = 'User Details Edited succesfully';
                 }else{
                    this.confirmDialogRef.componentInstance.Message = 'User is registered succesfully';
                 }
                
              //  alert('Member is registered succesfully');
              
              this.confirmDialogRef.afterClosed().subscribe(result => {
                if ( result )
                {
                    this.router.navigate(['/userlist']);
                }
                this.confirmDialogRef = null;
            });
            }else {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
                this.confirmDialogRef.componentInstance.isError = true;
                if (this.registerid == Type.userEdit){
                    if (data['Data'] === -1){
                        this.confirmDialogRef.componentInstance.Message = 'Error in User Edition Please Try again';
                    }else if (data['Data'] === -2) {
                        this.confirmDialogRef.componentInstance.Message = 'Already Exixts';
                    }else if (data['Data'] === -3) {
                        this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';
                    }else if (data['Data'] === 0) {
                        this.confirmDialogRef.componentInstance.Message = 'Record Already Exixts';
                    }
                    this.confirmDialogRef.afterClosed().subscribe(result => {
                        if ( result )
                        {
                            this.router.navigate(['/userlist']);
                        }
                        this.confirmDialogRef = null;
                    });
                 }else{
                    if (data['Data'] === -1){
                        this.confirmDialogRef.componentInstance.Message = 'Error Occured';
                    }else if (data['Data'] === -2) {
                        this.confirmDialogRef.componentInstance.Message = 'Already Exixts';
                    }else if (data['Data'] === -3) {
                        this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';
                    }else if (data['Data'] === 0) {
                        this.confirmDialogRef.componentInstance.Message = 'Record Already Exixts';
                    }
                 }
               // this.confirmDialogRef.componentInstance.Message = 'User registration is unsuccesfull Please try again';
        
            }
          });
      }
   
  }   
  goBack(): void {
    this.router.navigate(['/userlist']);
  }
  toggleSidebarOpen(key): void
  {
   this._fuseSidebarService.getSidebar(key).toggleOpen();
  }
   

}
