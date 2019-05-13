import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { MemberService } from '../services/member/member.service';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ApiService } from '../services/common/common.service';
import { EditService } from '../services/member/edit.service';
import {AuthService} from '../authentication/auth.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import {DialogComponent} from '../dialog/dialog.component';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import {Type} from '../utility/type';
import {UserModel} from '../business-object/userbo';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss', '../scss/listing.scss', '../scss/settingbutton.scss']
})
export class UserManagementComponent implements OnInit {
    displayedColumns: string[] = ['Name', 'Email', 'Status', 'Edit'];
    dataSource: MatTableDataSource<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DialogRef: MatDialogRef<DialogComponent>;
    deleteDialogRef: MatDialogRef<DialogComponent>;
    enableSearch: Boolean = false;
    makesearch: Boolean = false;
    pageNo = 1;
    horizontalStepperStep1: FormGroup;
    horizontalStepperStep3: FormGroup;
    getuserlistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
    };
    getRecordReq = {};
    getDecryptReq = {};
    userlist: UserModel[]; 
    countires: Array<object>;
    country: any = [];
    regionrequest = {};
    regiondata: any;
    regions: any = [];
    centrerequest: any = {};
    centredata: any;
    centers: any = [];
    churchrequest: any = {};
    churchdata: any;
    churchs: any = [];
    currUser: any;
    decrypt: any;
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    enableAll: Boolean = false;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public countryFilterCtrl: FormControl = new FormControl();
    public regionFilterCtrl: FormControl = new FormControl();
    public centreFilterCtrl: FormControl = new FormControl();
    public churchFilterCtrl: FormControl = new FormControl();
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredCentre: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredChurch: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1); 
    constructor(private _formBuilder: FormBuilder,
                private apiService: ApiService,
                private authService: AuthService,
                private memberService: MemberService,
                private editService: EditService,
                public _matDialog: MatDialog,
                private _fuseSidebarService: FuseSidebarService,
                private router: Router,
                private GlobalUrls: GlobalUrl) {

      this.getUsers();

    }
  
ngOnInit(): void {
 
  
    }
    getUsers(): void {
       
        this.memberService.getUserList(this.getuserlistrequest, this.header).subscribe((data: Array<object>) => {
            this.userlist = data['Data'];
            this.dataSource = new MatTableDataSource(this.userlist);
        });
        this.getuserlistrequest = {
            'PAGE_NO':  this.pageNo + 1,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
        };
        this.memberService.getUserList(this.getuserlistrequest, this.header).subscribe((data: Array<object>) => {
            if (data['Data'] === null) {
               this.disablenext = true;
            }else {
                this.disablenext = false;  
            }
        }); 
    }

    applyFilter(filterValue: string): void {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
   
    nextPage(): any {
       
        this.pageNo += 1;
        this.disableprev = false;
        this.getuserlistrequest = {
            'PAGE_NO':  this.pageNo,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
        };
   
     this.getUsers();
    }
    previousPage(): any {
        this.pageNo -= 1;
        this.disablenext = false;
        if (this.pageNo < 2) {
            this.disableprev = true;
         }
        this.getuserlistrequest = {
            'PAGE_NO':  this.pageNo,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
        };
    
      this.getUsers();

    } 
  
       forEdit(value): any {
           console.log(value);
       this.getRecordReq = {
           'REC_PK': value['USR_PK']
       };
      
      
       this.memberService.getUser(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
        this.currUser = data['Data'][0];
       
        this.getDecryptReq = {
            'DECRIPT': this.currUser['USR_PASSWORD']
        };
       
        this.apiService.getDecrypt(this.getDecryptReq,  this.header).subscribe((retvalue: Array<object>)=> {
           
        this.currUser['USR_PASSWORD']=retvalue['Data'];
        
        this.editService.changeUser(this.currUser);
        this.router.navigate(['/userregistration/' +  Type.userEdit]);
    });
});
       
}
     forView(value): void {
        this.getRecordReq = {
            'REC_PK': value['USR_PK']
        };
       
        this.memberService.getUser(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
        this.currUser = data['Data'][0];

         this.editService.changeUser(this.currUser);
        
       });
 
        this.router.navigate(['/userregistration/' +  Type.userView]);
     }
     forDelete(value): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                console.log(result);
                this.getRecordReq = {
                    'REC_PK': value['USR_PK']
                };
               
                this.memberService.getUser(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
                 this.currUser = data['Data'][0];
                 const deleteReq = {
                    'REC_PK': this.currUser['USR_PK'],
                    'LAST_MOD_DT': this.currUser['LAST_MOD_DT']
                };
                this.memberService.deleteUser(deleteReq, this.header).subscribe((res: Array<object>) => {
                    console.log(res);
                    if (res['Data'] > 0) {
                        this.DialogRef = this._matDialog.open(DialogComponent, {
                            disableClose: true
                        });
                
                        this.DialogRef.componentInstance.Message = 'Record Deleted Successfully';
                
                        this.DialogRef.afterClosed().subscribe(results => {
                            if ( results )
                            {
                                this.getuserlistrequest = {
                                    'PAGE_NO': 1,
                                    'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                    'USER_PK': 1,
                                };
                                this.getUsers();
                               
                            }
                            this.DialogRef = null;
                      });
                }else{
                    this.DialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
                    if (res['Data'] == 0){
                        this.DialogRef.componentInstance.Message = 'Already assigned cannot Delete';
                    }else if (res['Data'] == -1) {
                        this.DialogRef.componentInstance.Message = 'Error occured';
                    }else if (res['Data'] == -3) {
                        this.DialogRef.componentInstance.Message = 'Already modified by another user';
                    }else if (res['Data'] == -5) {
                        this.DialogRef.componentInstance.Message = 'Already Deleted';
                    } 
                    this.DialogRef.afterClosed().subscribe(results => {
                        if ( results )
                        {
                            this.getuserlistrequest = {
                                'PAGE_NO': 1,
                                'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                'USER_PK': 1,
                            };
                            this.getUsers();
                           
                        }
                        this.DialogRef = null;
                  });
                }
                   });
                });
            }
            this.confirmDialogRef = null;
        });
    }
    addUsernav(): void {
        this.router.navigate(['/userregistration'] );
    }
    toggleSidebarOpen(key): void
    {
     this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
