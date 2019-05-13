import { Component, OnInit , OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ApiService } from '../services/common/common.service';
import { MemberService } from '../services/member/member.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { EditService } from '../services/member/edit.service';
import {AuthService} from '../authentication/auth.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { CommonEditService } from '../services/common/edit.service';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {GlobalUrl} from '../utility/GlobalUrl';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { v4 as uuid } from 'uuid';
import {Type} from '../utility/type';
import {NewsSavReqModel} from '../business-object/newsbo';
@Component({
  selector: 'app-news-registration',
  templateUrl: './news-registration.component.html',
  styleUrls: ['./news-registration.component.scss', '../scss/form.scss',  '../scss/settingbutton.scss']
})
export class NewsRegistrationComponent implements OnInit {
    horizontalStepperStep1: FormGroup;
    members: any;
    currentNews: any;
    registerid: any;
    saveReq: NewsSavReqModel;
    enableclose: Boolean = false;
    confirmDialogRef: MatDialogRef<DialogComponent>;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } }; 
   public memberFilterCtrl: FormControl = new FormControl();
   public filteredMembers: ReplaySubject<Array<any>> = new ReplaySubject<any[]>(1);

   constructor(
                 private _formBuilder: FormBuilder,
                 private apiService: ApiService,
                 private memberService: MemberService,
                 private editService: EditService,
                 private authService: AuthService,
                  private commonEditService: CommonEditService,
                  private _fuseSidebarService: FuseSidebarService,
                 private router: Router,
                 private act_route: ActivatedRoute,
                 public _matDialog: MatDialog,
                 private httpClient: HttpClient,
                 private GlobalUrls: GlobalUrl
               ) { }
   
     ngOnInit(): void {
 
        this.commonEditService.currentNews.subscribe(message => {
            this.currentNews = message;
            console.log(this.currentNews);
            this.act_route.params.subscribe(params => {
      
                  this.registerid = params['id'];
        
                 if (this.registerid == Type.newsEdit) {
                     if (this.currentNews['NWE_ACTIVE'] == 1){
                        this.currentNews['NWE_ACTIVE'] = true;
                     }else {
                        this.currentNews['NWE_ACTIVE'] = false;
                     }
                    this.horizontalStepperStep1 = this._formBuilder.group({
                        title: [ this.currentNews['NWE_TITLE'], Validators.required],
                        publish: [ this.currentNews['NWE_PUBLISH_ON'].substring(0, 10), Validators.required],
                        description: [this.currentNews['NWE_DESC'], Validators.required],
                        details: [this.currentNews['NWE_DETAILS']],
                        active: [this.currentNews['NWE_ACTIVE']]
                      
                      });
                 }else if (this.registerid == Type.newsView) {
                    this.enableclose = true;
                    if (this.currentNews['NWE_ACTIVE'] == 1){
                        this.currentNews['NWE_ACTIVE'] = true;
                     }else {
                        this.currentNews['NWE_ACTIVE'] = false;
                     }
                    this.horizontalStepperStep1 = this._formBuilder.group({
                        title: [ this.currentNews['NWE_TITLE'], Validators.required],
                        publish: [ this.currentNews['NWE_PUBLISH_ON'].substring(0, 10), Validators.required],
                        description: [this.currentNews['NWE_DESC'], Validators.required],
                        details: [this.currentNews['NWE_DETAILS']],
                        active: [this.currentNews['NWE_ACTIVE']]
                      
                      
                      });
                      this.horizontalStepperStep1.disable();
                 }else{
                     
                     this.horizontalStepperStep1 = this._formBuilder.group({
                         title: ['', Validators.required],
                         publish: ['', Validators.required],
                         description: ['', Validators.required],
                         details: [''],
                         active: ['']
                        //  email: ['',  Validators.email],
                        // member: ['']
              
                    });
                 }
            });   
            this.getMembers();
            this.memberFilterCtrl.valueChanges
            .subscribe(() => {
              this.filterMembers();
            });   
        });   
         
        
   }   
   getMembers(): any {
    this.memberService.getMember().subscribe((data: Array<object>) => {
       this.members = data['Data'];
       this.filteredMembers.next(this.members.slice());


  });
  }   
  private filterMembers(): void {
  
    let search = this.memberFilterCtrl.value;
    if (!search) {
     // this.filteredMembers.next(this.memberlist.slice());
     this.filteredMembers.next(this.members.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
 
    this.filteredMembers.next(
      this.members.filter(member => {
        if (member['MMM_NAME1'].toLowerCase().indexOf(search) > -1){
           return member;
        }else if (member['MMM_NAME2'] != '' && member['MMM_NAME2'] != null) {
            if (member['MMM_NAME2'].toLowerCase().indexOf(search) === 0){
                return member;
            } 
        }
      })
    );
  }  
  register(): void{
    //   console.log(this.horizontalStepperStep1.value);
          if (this.horizontalStepperStep1.value.active === true){
            this.horizontalStepperStep1.value.active = 1;
          }else{
            this.horizontalStepperStep1.value.active = 0;
          }
          if (this.registerid == Type.newsEdit){
            this.saveReq = {
                'NWE_PK': this.currentNews['NWE_PK'],
                'NWE_TITLE': this.horizontalStepperStep1.value.title,
                'NWE_DESC': this.horizontalStepperStep1.value.description,
                'NWE_DETAILS':  this.horizontalStepperStep1.value.details,
                'NWE_PUBLISH_ON':  this.horizontalStepperStep1.value.publish,
                'NWE_ACTIVE':  this.horizontalStepperStep1.value.active,
                'USER_PK': 1,
                'LAST_MOD_DT': this.currentNews['LAST_MOD_DT']
            }; 
          }else{
            this.saveReq = {
                'NWE_PK': 0,
                'NWE_TITLE': this.horizontalStepperStep1.value.title,
                'NWE_DESC': this.horizontalStepperStep1.value.description,
                'NWE_DETAILS':  this.horizontalStepperStep1.value.details,
                'NWE_PUBLISH_ON':  this.horizontalStepperStep1.value.publish,
                'NWE_ACTIVE':  this.horizontalStepperStep1.value.active,
                'USER_PK': 1,
                'LAST_MOD_DT': new Date()
            };
          }
        
          console.log(this.saveReq);
          this.apiService.postNews(this.saveReq, this.header).subscribe((data) => {
              console.log(data);
              if (data['Data'] > 0) {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
                 if (this.registerid == Type.newsEdit){
                    this.confirmDialogRef.componentInstance.Message = 'News Details Edited succesfully';
                 }else{
                    this.confirmDialogRef.componentInstance.Message = 'News is registered succesfully';
                 }
                
              //  alert('Member is registered succesfully');
              
              this.confirmDialogRef.afterClosed().subscribe(result => {
                if ( result )
                {
                   this.router.navigate(['/newslist']);
                }
                this.confirmDialogRef = null;
            });
            }else {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
                this.confirmDialogRef.componentInstance.isError = true;
                if (this.registerid == Type.newsEdit){
                    if (data['Data'] === -1){
                        this.confirmDialogRef.componentInstance.Message = 'Error in News Edition Please Try again';
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
                            this.router.navigate(['/churchlist']);
                        }
                        this.confirmDialogRef = null;
                    });
                  //  this.confirmDialogRef.componentInstance.Message = 'User Updation is unsuccessfull Please try again';
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
  goBack(): void {
    this.router.navigate(['/newslist']);
  }
  toggleSidebarOpen(key): void
  {
   this._fuseSidebarService.getSidebar(key).toggleOpen();
  }
}
