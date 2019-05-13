import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MemberService } from '../services/member/member.service';
import { ApiService } from '../services/common/common.service';
import {AuthService} from '../authentication/auth.service';
import { EditService } from '../services/member/edit.service';
import { CommonEditService } from '../services/common/edit.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import {DialogComponent} from '../dialog/dialog.component';
import { Router } from '@angular/router';
import {Type} from '../utility/type';
import {NewsModel} from '../business-object/newsbo';
@Component({
  selector: 'app-news-management',
  templateUrl: './news-management.component.html',
  styleUrls: ['./news-management.component.scss', '../scss/listing.scss',  '../scss/settingbutton.scss']
})
export class NewsManagementComponent implements OnInit {
    displayedColumns: string[] = ['Name', 'Email', 'Status', 'Edit'];
    dataSource: MatTableDataSource<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DialogRef: MatDialogRef<DialogComponent>;
    pageNo = 1;
    getNewslistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
    };
    getRecordReq = {};
    newslist: NewsModel[] = []; 
    currNews: any;
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    enableAll: Boolean = false;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } }; 
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(private apiService: ApiService,
                private memberService: MemberService,
                private authService: AuthService,
                private commonEditService: CommonEditService,
                private _fuseSidebarService: FuseSidebarService,
                public _matDialog: MatDialog,
                private router: Router,
                private GlobalUrls: GlobalUrl) {

      this.getNewsList();

    }
  
ngOnInit(): void {
 
  
    }
    getNewsList(): void {
        this.apiService.getEventNewsList(this.getNewslistrequest, this.header).subscribe((data: Array<object>) => {
            // for (let i = 0; i < data['Data'].length; i++) {
            //     if (data['Data'][i]['NWE_ACTIVE'] === 1) {
            //         this.newslist.push(data['Data'][i]);
            //     }
            // }
            this.newslist = data['Data'];
            this.dataSource = new MatTableDataSource(this.newslist);
        });
        this.getNewslistrequest = {
            'PAGE_NO':  this.pageNo + 1,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
        };
        this.apiService.getEventNewsList(this.getNewslistrequest, this.header).subscribe((data: Array<object>) => {
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
        this.getNewslistrequest = {
            'PAGE_NO':  this.pageNo,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
        };
     
     this.getNewsList();
    }
    previousPage(): any {
        this.pageNo -= 1;
        this.disablenext = false;
        if (this.pageNo < 2) {
            this.disableprev = true;
         }
        this.getNewslistrequest = {
            'PAGE_NO':  this.pageNo,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
        };
   
      this.getNewsList();

    } 
   
       forEdit(value): any {
           console.log(value);
       this.getRecordReq = {
           'REC_PK': value['NWE_PK']
       };
       this.apiService.getNewsDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
        this.currNews = data['Data'][0];
        this.commonEditService.changeNews(this.currNews);

    });

        this.router.navigate(['/newsregistration/' +  Type.newsEdit]);
     }
     forView(value): void {
        this.getRecordReq = {
            'REC_PK': value['NWE_PK']
        };
        this.apiService.getNewsDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
        this.currNews = data['Data'][0];

         this.commonEditService.changeNews(this.currNews);
        
       });
 
        this.router.navigate(['/newsregistration/' +  Type.newsView]);
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
                    'REC_PK': value['NWE_PK']
                };
                this.apiService.getNewsDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
                 this.currNews = data['Data'][0];
                 const deleteReq = {
                    'REC_PK': this.currNews['NWE_PK'],
                    'LAST_MOD_DT': this.currNews['LAST_MOD_DT']
                };
                this.apiService.deleteNews(deleteReq, this.header).subscribe((res: Array<object>) => {
                    console.log(res);
                    if (res['Data'] > 0) {
                        this.DialogRef = this._matDialog.open(DialogComponent, {
                            disableClose: true
                        });
                
                        this.DialogRef.componentInstance.Message = 'Record Deleted Successfully';
                
                        this.DialogRef.afterClosed().subscribe(results => {
                            if ( results )
                            {
                                this.newslist = [];
                                this.getNewslistrequest = {
                                    'PAGE_NO': 1,
                                    'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                    'USER_PK': 1,
                                };
                                this.getNewsList();
                               
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
                            this.getNewslistrequest = {
                                'PAGE_NO': 1,
                                'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                'USER_PK': 1,
                            };
                            this.getNewsList();
                           
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
    addNewsnav(): void {
        this.router.navigate(['/newsregistration'] );
    }
    toggleSidebarOpen(key): void
    {
     this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
