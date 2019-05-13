import {Inject, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ApiService } from '../services/common/common.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import {AuthService} from '../authentication/auth.service';
import { EditService } from '../services/member/edit.service';
import {MemberService} from '../services/member/member.service';
import {MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import {AddMemberrenewalComponent} from '../add-memberrenewal/add-memberrenewal.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {Type} from '../utility/type';
@Component({
  selector: 'app-member-renewal',
  templateUrl: './member-renewal.component.html',
  styleUrls: ['./member-renewal.component.scss',
              '../scss/listing.scss',
              '../scss/settingbutton.scss']
})
// export interface MemRenewMapDetails{
//     MRD_MEMBER: number;
//     MRD_DUE_DATE_OLD: Date;
// }
export class MemberRenewalComponent implements OnInit {
    displayedColumns: string[] = ['ID', 'Name', 'duedate', 'Mobile'];
    searchForm: FormGroup;
    dataSource: MatTableDataSource<any>;
    memberlist: Array<object> = [{}];
    enabletable: Boolean = false;
    isView: Boolean = false;
    registerid: any;
    reqList: Array<any> = [];
    pageNo = 1;
    disablenext: Boolean = true;
    disableprev: Boolean = true;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    centrelistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'CTR_REGION': null,
        'CTR_COUNTRY': null
    };
    DialogRef: MatDialogRef<AddMemberrenewalComponent>;
    confirmDialogRef: MatDialogRef<DialogComponent>;
  constructor( private _formBuilder: FormBuilder,
               private GlobalUrls: GlobalUrl,
               public _matDialog: MatDialog,
               private router: Router,
               private editService: EditService,
               private act_route: ActivatedRoute,
               private memberService: MemberService,
               private authService: AuthService,
               private apiService: ApiService,
               private _fuseSidebarService: FuseSidebarService ) { }

  ngOnInit(): void {
    this.editService.currentRenewView.subscribe( data => {
         console.log(data);
         this.act_route.params.subscribe(params => {
            //  this.registerid = params['id'];
            console.log(params['id']);
            if (params['id'] == Type.renewView ) {
              this.isView = true;
              this.memberlist = data['MAP_DETAILS'];
              if (this.memberlist.length > 0) {
                this.enabletable = true;
            }
              this.dataSource = new MatTableDataSource(this.memberlist);
                  this.searchForm = this._formBuilder.group({
                      from: [data['MRH_DATE'].substring(0, 10)],
                      to: [data['MRH_DUE_DATE_NEW'].substring(0, 10)],
                      remarks: [data['MRH_REMARKS']]
                  });
                  this.searchForm.disable();
                
            }else {
              this.editService.currentRenewList.subscribe(datas => {
                  this.memberlist = datas;
                  console.log(this.memberlist);
                  if (this.memberlist.length > 0) {
                      this.enabletable = true;
                  }
                  console.log(this.memberlist);
                  this.dataSource = new MatTableDataSource(this.memberlist);
                });
              this.searchForm = this._formBuilder.group({
                  from: [ new Date().toISOString().substring(0, 10)],
                  to: [''],
                  remarks: ['']
              });
            }
          });
    });  
  
  }
  closeFun(): void {
    this.router.navigate(['/memberrenewal']);
  }
  register(): void {
    if (this.reqList.length === 0) {
        for (let i = 0; i < this.memberlist.length; i++){
            const data = {
                'MRD_MEMBER': this.memberlist[i]['MMM_PK'],
                'MRD_DUE_DATE_OLD': this.memberlist[i]['MMM_DUE_DATE']
            };
            this.reqList.push(data);
       }
    }
    console.log(this.reqList.length);
    if (this.reqList.length === 0 ) {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.isError = true;
        this.confirmDialogRef.componentInstance.Message = 'Members are not Selected.Please Select Members';
    }else{
        console.log('register');
        const savReq = {
           'MRH_DATE': this.searchForm.value.from,
           'MRH_DUE_DATE_NEW': this.searchForm.value.to,
           'MRH_REMARKS': this.searchForm.value.remarks,
           'USER_PK': 1,
           'LAST_MOD_DT': new Date().toISOString(),
           'MAP_DETAILS': this.reqList
        };
        console.log(savReq);
    
        this.memberService.registerRenewal(savReq, this.header).subscribe((data) => {
            if (data['Data'] > 0) {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
         
                this.confirmDialogRef.componentInstance.Message = 'Members Renewed SuccesFully';
            
              
              this.confirmDialogRef.afterClosed().subscribe(result => {
                if ( result )
                {
                    this.editService.changeRenewList([]);
                    this.router.navigate(['/memberrenewal']);
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
                this.confirmDialogRef.afterClosed().subscribe(result => {
                    if ( result )
                    {
                        this.editService.changeRenewList([]);
                        this.router.navigate(['/memberrenewal']);
                    }
                    this.confirmDialogRef = null;
                });
            }
        });
    }
  
  }
addMember(): void {
    this.DialogRef = this._matDialog.open(AddMemberrenewalComponent, {
        disableClose: false,
        data      : {
            list  : this.memberlist
        }
    });
}
toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}
}
