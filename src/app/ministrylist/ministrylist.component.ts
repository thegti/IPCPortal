import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {DialogComponent} from '../dialog/dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { MemberService } from '../services/member/member.service';
import { ApiService } from '../services/common/common.service';
import { EditService } from '../services/member/edit.service';
import {AuthService} from '../authentication/auth.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import {Type} from '../utility/type';
import {MemberModel} from '../business-object/memberbo';
@Component({
  selector: 'app-ministrylist',
  templateUrl: './ministrylist.component.html',
  styleUrls: ['./ministrylist.component.scss', '../scss/listing.scss', '../scss/settingbutton.scss']
})
export class MinistrylistComponent implements OnInit {
    displayedColumns: string[] = ['ID','Title', 'Name', 'Mobile', 'Church', 'Edit'];
    dataSource: MatTableDataSource<any>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DialogRef: MatDialogRef<DialogComponent>;
    enableSearch: Boolean = false;
    pageNo = 1;
    horizontalStepperStep1: FormGroup;
    stprTeritary: FormGroup;
    ministrylistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': null,
        'MMM_REGION': null,
        'MMM_COUNTRY': null,
        'MMM_CHURCH': null,
        
    };
    getRecordReq = {};
    titlerequest = {};
    ministrylist: MemberModel[]; 
    countires: Array<object>;
    country: any = [];
    ddlCountry: any = [];
    regionrequest = {};
    regiondata: any;
    regions: any = [];
    centrerequest: any = {};
    centredata: any;
    centers: any = [];
    churchrequest: any = {};
    churchdata: any;
    churchs: any = [];
    currMininstry: any;
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    enableAll: Boolean = false;
    makesearch: Boolean = false;
    title: Array<object> = [];
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    @ViewChild(MatSort) sort: MatSort;
    public countryFilterCtrl: FormControl = new FormControl();
    public regionFilterCtrl: FormControl = new FormControl();
    public centreFilterCtrl: FormControl = new FormControl();
    public churchFilterCtrl: FormControl = new FormControl();
    public titleFilterCtrl: FormControl = new FormControl();
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredText: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredCentre: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredChurch: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1); 
  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private memberService: MemberService,
    private authService: AuthService,
    private editService: EditService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    private router: Router,
    private GlobalUrls: GlobalUrl
  ) {
    this.getMinistryList(this.ministrylistrequest);
   }

  ngOnInit(): void {
    this.editService.changeMember(this.editService.member);
    this.stprTeritary = this._formBuilder.group({
        ddlCountry: [null],
        ddlRegion: [null],
        ddlCentre: [null],
        ddlChurch: [null],
  });
  
   
this.getCountries();
this.getTitleText();

this.countryFilterCtrl.valueChanges
.subscribe(() => {
  this.filterCounts();
});
this.regionFilterCtrl.valueChanges
.subscribe(() => {
  this.filterRegions();
});
this.titleFilterCtrl.valueChanges
.subscribe(() => {
  this.filterTitles();
});
this.centreFilterCtrl.valueChanges
.subscribe(() => {
  this.filterCentres();
});
this.churchFilterCtrl.valueChanges
.subscribe(() => {
  this.filterChurches();
});

  }
  getMinistryList(ministrylistReq): any {
    this.memberService.getMinistryList(ministrylistReq, this.header).subscribe((data: Array<object>) => {
      this.ministrylist = data['Data'];
     console.log(data);
      this.dataSource = new MatTableDataSource(this.ministrylist);
      ministrylistReq = {
        'PAGE_NO':  this.pageNo + 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': this.stprTeritary.value.ddlCentre,
        'MMM_REGION': this.stprTeritary.value.ddlRegion,
        'MMM_COUNTRY': this.stprTeritary.value.ddlCountry,
        'MMM_CHURCH': this.stprTeritary.value.ddlChurch
     
    };
    this.memberService.getMinistryList(ministrylistReq, this.header).subscribe((ministryData: Array<object>) => {
        if (ministryData['Data'] === null) {
           this.disablenext = true;
        }else {
            this.disablenext = false;  
        }
    });
  });
}
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.paginator);
  }
  register(): any {
      this.enableSearch = true;
  }
  enbleSearch(): any {
      this.stprTeritary.reset();
      this.enableSearch = true;
      this.makesearch = false;
  }
  nextPage(): any {
     
    this.pageNo += 1;
    this.disableprev = false;
    this.ministrylistrequest = {
        'PAGE_NO':  this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': this.stprTeritary.value.ddlCentre,
        'MMM_REGION': this.stprTeritary.value.ddlRegion,
        'MMM_COUNTRY': this.stprTeritary.value.ddlCountry,
        'MMM_CHURCH': this.stprTeritary.value.ddlChurch
    };
    this.getMinistryList(this.ministrylistrequest);
  }
  previousPage(): any {
      this.pageNo -= 1;
      this.disablenext = false;
      if (this.pageNo < 2) {
        this.disableprev = true; 
      }
      this.ministrylistrequest = {
          'PAGE_NO':  this.pageNo,
          'PAGE_SIZE' : this.GlobalUrls.pageSize,
          'USER_PK': 1,
          'MMM_CENTRE': this.stprTeritary.value.ddlCentre,
          'MMM_REGION': this.stprTeritary.value.ddlRegion,
          'MMM_COUNTRY': this.stprTeritary.value.ddlCountry,
          'MMM_CHURCH': this.stprTeritary.value.ddlChurch
      };
      this.getMinistryList(this.ministrylistrequest);
  } 
  getCountries(): any {
      this.apiService.getCountry(this.header).subscribe((data: Array<object>) => {
          this.countires = data['Data'];
          this.filteredCount.next(this.countires.slice());
    });
  }
  getTitleText(): void {
    this.titlerequest = {
        'CFG_TYPE': 'TITLE'
    };
    this.apiService.getConfigValues(this.titlerequest,this.header).subscribe((data: Array<object>) => {
        this.title = data['Data'];
     
        this.filteredText.next(this.title.slice());
  
   });

}
  filterMinistry(): void {
    this.pageNo = 1;
    this.disableprev = true;
   this.ministrylistrequest = {
    'PAGE_NO':  this.pageNo,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'MMM_CENTRE': this.stprTeritary.value.ddlCentre,
    'MMM_REGION': this.stprTeritary.value.ddlRegion,
    'MMM_COUNTRY': this.stprTeritary.value.ddlCountry,
    'MMM_CHURCH': this.stprTeritary.value.ddlChurch
   };
   this.enableSearch = false;
  this.getMinistryList(this.ministrylistrequest);
  this.enableAll = true;
  }
  getAllMembers(): void{
    this.pageNo = 1;
    this.disableprev = true;
    this.ministrylistrequest = {
        'PAGE_NO': this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': null,
        'MMM_REGION': null,
        'MMM_COUNTRY': null,
        'MMM_CHURCH': null
    };
    this.getMinistryList(this.ministrylistrequest);
    this.stprTeritary.reset();
    this.enableAll = false;
}
  onCountrySelect(): any {
      this.makesearch = true;
      this.stprTeritary.controls.ddlRegion.reset();
      this.stprTeritary.controls.ddlCentre.reset();
      this.stprTeritary.controls.ddlChurch.reset();
      this.filteredRegion.next([]);
      this.filteredCentre.next([]);
      this.filteredChurch.next([]);
      this.regionrequest = {
        'RGN_COUNTRY':  this.stprTeritary.value.ddlCountry
      };
      this.apiService.getRegion(this.regionrequest, this.header).subscribe((data: Array<object>) => {
      this.regiondata = data['Data'];
      if (this.regiondata != null) {
      this.filteredRegion.next(this.regiondata.slice());
      }
      });
     
  }
  onRegionSelect(): void {
      
      this.stprTeritary.controls.ddlCentre.reset();
      this.stprTeritary.controls.ddlChurch.reset();
      this.filteredCentre.next([]);
      this.filteredChurch.next([]);
       this.centrerequest = {
                                'CTR_REGION':  this.stprTeritary.value.ddlRegion
                             };
       this.apiService.getCentre(this.centrerequest,  this.header).subscribe((data: Array<object>) => {
        this.centredata = data['Data'];
        if (this.centredata != null) {
          this.filteredCentre.next(this.centredata.slice());
        }
      });
  }
  onCentreSelect(): void {
      this.stprTeritary.controls.ddlChurch.reset();
      this.filteredChurch.next([]);
      this.churchrequest = {
        'CCH_CENTRE': this.stprTeritary.value.ddlCentre
    };

   this.apiService.getChurch(this.churchrequest,  this.header).subscribe((data: Array<object>) => {
   this.churchdata = data['Data'];
     if (this.churchdata != null) {
     this.filteredChurch.next(this.churchdata.slice());
      }
   });
   
  }
  private filterTitles(): void {
    let search = this.titleFilterCtrl.value;
    if (!search) {
        this.filteredText.next(this.title.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
 
      this.filteredText.next(
        this.title.filter(config => config['CFG_DATA'].toLowerCase().indexOf(search) > -1)
      );
}  
  private filterCounts(): void {
    
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCount.next(this.countires.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
 
    this.filteredCount.next(
        this.countires.filter(country => country['CNT_NAME'].toLowerCase().indexOf(search) > -1)
    );
    }
  private filterRegions(): void {
    let search = this.regionFilterCtrl.value;
    if (!search) {
      this.filteredRegion.next(this.regiondata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Regions
    this.filteredRegion.next(
      this.regiondata.filter(regions => regions['RGN_NAME'].toLowerCase().indexOf(search) > -1)
    );
  }  
  private filterCentres(): void {
    let search = this.centreFilterCtrl.value;
    if (!search) {
        this.filteredCentre.next(this.centredata.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the Centres
      this.filteredCentre.next(
        this.centredata.filter(centers => centers['CTR_NAME'].toLowerCase().indexOf(search) > -1)
      );
  }
  private filterChurches(): void {
    let search = this.churchFilterCtrl.value;
    if (!search) {
        this.filteredChurch.next(this.churchdata.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the churchs
      this.filteredChurch.next(
        this.churchdata.filter(churchs => churchs['CCH_NAME'].toLowerCase().indexOf(search) > -1)
      );
  }
  closeFun(): any {
    this.enableSearch = false;
    this.stprTeritary.reset();
      
  }
  checkcountryselection(): void {
      if (this.stprTeritary.value.ddlCountry === '') {
         alert('Please Select the country');
      }
  }
  checkCntryandRegselection(): void {
         if (this.stprTeritary.value.ddlCountry === '' && this.stprTeritary.value.ddlRegion === '' ) {
             alert('Please Select the Country and Region');
          }else if (this.stprTeritary.value.ddlRegion === '') {
             alert('Please Select the Region');
          } 
   }
   checkrequiredfields(): void {
         if (this.stprTeritary.value.ddlCountry === '' && this.stprTeritary.value.ddlRegion === '' && this.stprTeritary.value.ddlCentre === '') {
             alert('Please Select the Country,Region and Centre first');
          }else if (this.stprTeritary.value.ddlRegion === '' && this.stprTeritary.value.ddlCentre === '') {
             alert('Please Select the Region and Centre');
          }else if (this.stprTeritary.value.ddlCentre === '') {
             alert('Please Select the Centre');
          } 
   }
   forEdit(value): any {
         this.getRecordReq = {
         'REC_PK': value['MMM_PK']
         };
         this.header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
         this.memberService.getRecordDetails(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
         this.currMininstry = data['Data'][0];
     
         this.editService.changeMember(this.currMininstry);
       this.editService.currentMember.subscribe(message => {
          this.currMininstry = message;
          console.log(this.currMininstry);
      });
     
         });
          this.router.navigate(['/registration/' +  Type.editMinistry]);
    }
     forView(value): void {
        this.getRecordReq = {
            'REC_PK': value['MMM_PK']
        };
        this.header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
        this.memberService.getRecordDetails(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
         this.currMininstry = data['Data'][0];
        // console.log(value);
        // console.log(this.currMem);

         this.editService.changeMember(this.currMininstry);
          this.editService.currentMember.subscribe(message => {
             this.currMininstry = message;
            console.log(this.currMininstry);
         });
        
       });
 
        this.router.navigate(['/registration/' +  Type.viewMinistryDetails]);
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
                    'REC_PK': value['MMM_PK']
                };
                this.header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
                this.memberService.getRecordDetails(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
                 this.currMininstry = data['Data'][0];
                 const deleteReq = {
                    'REC_PK': this.currMininstry['MMM_PK'],
                    'LAST_MOD_DT': this.currMininstry['LAST_MOD_DT']
                };
                this.memberService.deleteMemberMinistry(deleteReq, this.header).subscribe((res: Array<object>) => {
                    console.log(res);
                    if (res['Data'] > 0) {
                        this.DialogRef = this._matDialog.open(DialogComponent, {
                            disableClose: true
                        });
                
                        this.DialogRef.componentInstance.Message = 'Record Deleted Successfully';
                
                        this.DialogRef.afterClosed().subscribe(results => {
                            if ( results )
                            {
                                this.ministrylistrequest = {
                                    'PAGE_NO': 1,
                                    'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                    'USER_PK': 1,
                                    'MMM_CENTRE': null,
                                    'MMM_REGION': null,
                                    'MMM_COUNTRY': null,
                                    'MMM_CHURCH': null
                                };
                                this.getMinistryList(this.ministrylistrequest);
                               
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
                            this.ministrylistrequest = {
                                'PAGE_NO': 1,
                                'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                'USER_PK': 1,
                                'MMM_CENTRE': null,
                                'MMM_REGION': null,
                                'MMM_COUNTRY': null,
                                'MMM_CHURCH': null
                            };
                            this.getMinistryList(this.ministrylistrequest);
                           
                        }
                        this.DialogRef = null;
                  });
                }

                });
                });
              //  this._contactsService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });
    }
     addministrynav(): void {
      this.router.navigate(['/registration/' + Type.Ministry] );
     }
     toggleSidebarOpen(key): void
     {
      this._fuseSidebarService.getSidebar(key).toggleOpen();
     }



     
  }


