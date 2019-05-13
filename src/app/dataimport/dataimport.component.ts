import { Component, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { MatStepper } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MemberService } from '../services/member/member.service';
import {AuthService} from '../authentication/auth.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import { ApiService } from '../services/common/common.service';
import {CommonEditService} from '../services/common/edit.service';
import {Type} from '../utility/type';
import { v4 as uuid } from 'uuid';
import {MemberSaveReqModel} from '../business-object/memberbo';
import {GlobalUrl} from '../utility/GlobalUrl';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dataimport',
  templateUrl: './dataimport.component.html',
  styleUrls: ['./dataimport.component.scss', '../scss/form.scss', '../scss/settingbutton.scss']
})
export class DataimportComponent  implements OnInit {
    
    horizontalStepperStep1: FormGroup;
    members: any;
    files:any;
    memberlist = [];
    saveRequest: MemberSaveReqModel;
    selectedfile: File;
    imgname: any = '';
    imgChange: Boolean = false;
    formdt: FormData = new FormData();
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
      url = '../../assets/loginasset/images/display-img.jpg';
    moddate: any;
    isView: Boolean = false;
    selectedFiles: FileList;
fileName: string;

    confirmDialogRef: MatDialogRef<DialogComponent>;
    
    @ViewChild('stepper') stepper: MatStepper;
   
    constructor(
      private _formBuilder: FormBuilder,
      private apiService: ApiService,
      private memberService: MemberService,
      private authService: AuthService,
      private httpClient: HttpClient,
      private GlobalUrls: GlobalUrl,
      private _fuseSidebarService: FuseSidebarService,
      private router: Router,
      public _matDialog: MatDialog,
      private act_route: ActivatedRoute,) { }

  ngOnInit(): void {
     
 
  }
  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles[0].name;
    console.log('selectedFiles: ' + this.fileName );
  }
  onSelectionchange(event): void{
   
    this.imgChange = true;
     this.selectedfile = event.target.files[0];
     this.imgname = uuid() + '_' + this.selectedfile.name;
     this.formdt.append('image', this.selectedfile , this.imgname);
  
    if (event.target.files && event.target.files[0]) {
     const reader = new FileReader();
 
     reader.readAsDataURL(event.target.files[0]); // read file as data url
 
     reader.onload = (even) => { // called once readAsDataURL is completed
        this.url = even.target['result'];
       
      };
     }
   }
   register(): void {
  
    this.moddate =  new Date().toISOString();
 
    if (this.imgChange){
      this.memberService.memberFileInsert(this.formdt, this.header)
   .subscribe(res => {
     if (res['Message'] == 1) {
      this.memberService.registerMember(this.saveRequest).subscribe((data: Array<object>) => {
     
          if (data['Data'] > 0) {
              this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                  disableClose: true
              });
      
              this.confirmDialogRef.componentInstance.Message = 'Member is registered succesfully';
            //  alert('Member is registered succesfully');
            
            this.confirmDialogRef.afterClosed().subscribe(result => {
              if ( result )
              {
                  this.router.navigate(['/dataimport']);
              }
              this.confirmDialogRef = null;
          });
          }else {
              this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                  disableClose: true
              });
              this.confirmDialogRef.componentInstance.isError = true;
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
       });
        // alert('Image Saved Successfully');
     }else {
      this.confirmDialogRef = this._matDialog.open(DialogComponent, {
          disableClose: true
      });
      this.confirmDialogRef.componentInstance.isError = true;
      this.confirmDialogRef.componentInstance.Message = res['Message'];
       //  alert(res['Message']);
     }
   });
   }


}



 
 
 
   toggleSidebarOpen(key): void
   {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
   }
}
