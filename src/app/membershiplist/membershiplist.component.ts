import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { MemberService } from '../services/member/member.service';
import { ApiService } from '../services/common/common.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { EditService } from '../services/member/edit.service';
import {AuthService} from '../authentication/auth.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import {DialogComponent} from '../dialog/dialog.component';
import { ReplaySubject } from 'rxjs';
import { Router,ActivatedRoute } from '@angular/router';
import {Type} from '../utility/type';
import {MemberModel} from '../business-object/memberbo';
import {User} from '../authentication/user.model';
import { map, catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http';
import {FilterFields} from '../business-object/memberbo';
// export interface UserData {
//     id: string;
//     name: string;
//     progress: string;
//     color: string;
//   }

  /** Constants used to fill up our data base. */
//   const COLORS: string[] = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
//     'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
//   const NAMES: string[] = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//     'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//     'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];
  
@Component({
  selector: 'app-membershiplist',
  templateUrl: './membershiplist.component.html',
  styleUrls: ['./membershiplist.component.scss', '../scss/listing.scss', '../scss/settingbutton.scss']
})
export class MembershiplistComponent implements OnInit {
    displayedColumns: string[] = ['MMM_ID','Title', 'Name', 'MMM_MOBIL', 'MMM_CHURCH_NAME', 'Edit'];
   // dataSource: MatTableDataSource<any>;
   dataSource: MatTableDataSource<MemberModel>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DialogRef: MatDialogRef<DialogComponent>;
    enableSearch: Boolean = false;
    makesearch: Boolean = false;
    pageNo = 1;
    horizontalStepperStep1: FormGroup;
    stprMain: FormGroup;
    getmemberlistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': null,
        'MMM_REGION': null,
        'MMM_COUNTRY': null,
        'MMM_CHURCH': null,
        'MMM_MEMBER':null
    };
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
   countryID:any;
   regionID:any;
   centreID:any;
   churchID:any;
    getRecordReq = {};
    memberlist: MemberModel[]; 
    countires: Array<object>;
    ddlCountry: any = [];
    regionrequest = {};
    regiondata: any;
    regions: any = [];
    centrerequest: any = {};
    centredata: any;
    centers: any = [];
    churchrequest: any = {};
    memberrequest: any = {};
    churchdata: any;
    memberdata:any;
    churchs: any = [];
    currMem: any;
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    enableAll: Boolean = false;
    user: User;
    titlerequest = {};
    title: Array<object> = [];
    filterFields: FilterFields; 
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ViewChild(MatSort) sort: MatSort;
    public countryFilterCtrl: FormControl = new FormControl();
    public regionFilterCtrl: FormControl = new FormControl();
    public centreFilterCtrl: FormControl = new FormControl();
    public churchFilterCtrl: FormControl = new FormControl();
    public memberFilterCtrl: FormControl = new FormControl();
    public filteredText: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredCentre: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredChurch: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1); 
    public filteredMember: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1); 
    public titleFilterCtrl: FormControl = new FormControl();
    constructor(private _formBuilder: FormBuilder,
                private apiService: ApiService,
                private memberService: MemberService,
                private editService: EditService,
                private _fuseSidebarService: FuseSidebarService,
                public _matDialog: MatDialog,
                private router: Router,
                private authService: AuthService,
                private GlobalUrls: GlobalUrl,private act_route: ActivatedRoute) {
               

      //this.getMembers();
  
    }
  
ngOnInit(): void {
//  this.getallMembers();
  this.act_route.params.subscribe(params => {
    if(params['countryID']!=null)
    this.countryID = params['countryID'];
    else
    this.countryID=0;

    if(params['regionID']!=null)
    {
      this.regionID = params['regionID'];
    }
    else
    this.regionID=0;
    if(params['centreID']!=null)
    this.centreID = params['centreID'];
    else
    this.centreID=0;
    if(params['churchID']!=null){
    this.churchID = params['churchID'];
      if(this.countryID==0)
      this.getFilterFields({"CTR_PK": this.churchID});
    }
    else
    this.churchID=0;

    if(this.countryID>0 && this.regionID>0 && this.centreID>0 && this.churchID>0)
    {
      this.pageNo = 1;
      this.disableprev = true;
      this.getmemberlistrequest = {
       'PAGE_NO':  this.pageNo,
       'PAGE_SIZE' : this.GlobalUrls.pageSize,
       'USER_PK': 1,
       'MMM_CENTRE': this.centreID,
       'MMM_REGION': this.regionID,
       'MMM_COUNTRY': this.countryID,
       'MMM_CHURCH': this.churchID,
       'MMM_MEMBER': '',
      };
     this.getMemberList(this.getmemberlistrequest);
  
    }
    else
    this.getMembers();
 
});
    this.editService.changeMember(this.editService.member);
    this.stprMain = this._formBuilder.group({
      ddlCountry: [null],
      ddlRegion: [null],
      ddlCentre: [null],
      ddlChurch: [null],
      ddlMember:[null]
    });
     
  this.getCountries();
  this.getTitleText();

  this.countryFilterCtrl.valueChanges
  .subscribe(() => {
    this.filterCounts();
  });
  this.titleFilterCtrl.valueChanges
.subscribe(() => {
  this.filterTitles();
});
this.regionFilterCtrl.valueChanges
.subscribe(() => {
  this.filterRegions();
});
  this.centreFilterCtrl.valueChanges
  .subscribe(() => {
    this.filterCentres();
  });
  this.churchFilterCtrl.valueChanges
  .subscribe(() => {
    this.filterChurches();
  });
  this.memberFilterCtrl.valueChanges
  .subscribe(() => {
    this.filterMember();
  });

  
}


getallMembers(): any {
  this.filteredMember.next(this.members.slice());
//     this.memberService.getMember().subscribe((data: Array<object>) => {
//         this.members = data['Data'];
      
//        this.filteredMember.next(this.members.slice());
//   });
}
    getMembers(): void {
        this.user = this.authService.getUser();
        this.memberService.getMemberpageList(this.getmemberlistrequest, this.header).subscribe((data: Array<object>) => {
        this.memberlist = data['Data'];
        this.dataSource = new MatTableDataSource(this.memberlist);
        });
        this.getmemberlistrequest = {
            'PAGE_NO':  this.pageNo + 1,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
            'MMM_CENTRE': this.centreID >0 ? + this.centreID:this.stprMain.value.ddlCentre,
            'MMM_REGION': this.regionID >0 ? + this.regionID: this.stprMain.value.ddlRegion,
            'MMM_COUNTRY': this.countryID >0 ? + this.countryID :this.stprMain.value.ddlCountry,
            'MMM_CHURCH': this.churchID >0 ? + this.churchID:this.stprMain.value.ddlChurch,
            'MMM_MEMBER': null
        };
       // console.log(this.getmemberlistrequest);
        this.memberService.getMemberpageList(this.getmemberlistrequest, this.header).subscribe((data: Array<object>) => {
            if (data['Data'] === null) {
               this.disablenext = true;
            }else {
                this.disablenext = false;  
            }
            
        }); 
    }

    getMemberList(memberlistReq): any {
      this.memberService.getMemberpageList(memberlistReq, this.header).subscribe((data: Array<object>) => {
      this.memberlist = data['Data'];
      this.dataSource = new MatTableDataSource(this.memberlist);
    });
    console.log("Filter->")
    console.log(this.churchID);
    
    if(this.churchID>0)
    {
      memberlistReq = {
        'PAGE_NO':  this.pageNo + 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': '',
        'MMM_REGION': '',
        'MMM_COUNTRY': '',
        'MMM_CHURCH': +this.churchID,
        'MMM_MEMBER': ''
    };
    }
    else{
    memberlistReq = {
        'PAGE_NO':  this.pageNo + 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': this.stprMain.value.ddlCentre,
        'MMM_REGION': this.stprMain.value.ddlRegion,
        'MMM_COUNTRY': this.stprMain.value.ddlCountry,
        'MMM_CHURCH': this.stprMain.value.ddlChurch,
        'MMM_MEMBER': this.stprMain.value.ddlMember
    };
  }
  console.log(memberlistReq);
    this.memberService.getMemberpageList(memberlistReq, this.header).subscribe((data: Array<object>) => {
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
    register(): any {
        this.enableSearch = true;
    }
    enbleSearch(): any {
        this.enableSearch = true;
        this.makesearch = false;
    }
    nextPage(): any {
       
        this.pageNo += 1;
        this.disableprev = false;
        this.getmemberlistrequest = {
            'PAGE_NO':  this.pageNo,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
            'MMM_CENTRE': this.centreID>0 ? this.centreID:this.stprMain.value.ddlCentre,
            'MMM_REGION': this.regionID>0 ? this.regionID:this.stprMain.value.ddlRegion,
            'MMM_COUNTRY': this.countryID>0 ? this.countryID: this.stprMain.value.ddlCountry,
            'MMM_CHURCH': this.churchID>0 ? this.churchID:this.stprMain.value.ddlChurch,
            'MMM_MEMBER': this.stprMain.value.ddlMember
        };
        console.log( this.getmemberlistrequest);
        this.getMemberList(this.getmemberlistrequest);
    }
    previousPage(): any {
        this.pageNo -= 1;
        this.disablenext = false;
        if (this.pageNo < 2) {
            this.disableprev = true;
         }
        this.getmemberlistrequest = {
            'PAGE_NO':  this.pageNo,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
            'MMM_CENTRE': this.centreID>0 ? this.centreID:this.stprMain.value.ddlCentre,
            'MMM_REGION': this.regionID>0 ? this.regionID:this.stprMain.value.ddlRegion,
            'MMM_COUNTRY': this.countryID>0 ? this.countryID: this.stprMain.value.ddlCountry,
            'MMM_CHURCH': this.churchID>0 ? this.churchID:this.stprMain.value.ddlChurch,
            'MMM_MEMBER': this.stprMain.value.ddlMember
        };
        console.log( this.getmemberlistrequest);
        // this.memberService.getMemberpageList(this.getmemberlistrequest).subscribe((data: Array<object>) => {
        //     this.memberlist = data['Data'];
        //     this.dataSource = new MatTableDataSource(this.memberlist);
        // });
        this.getMemberList(this.getmemberlistrequest);
      

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
    filterMembers(): void {
       this.pageNo = 1;
       this.disableprev = true;
       this.getmemberlistrequest = {
        'PAGE_NO':  this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': this.stprMain.value.ddlCentre,
        'MMM_REGION': this.stprMain.value.ddlRegion,
        'MMM_COUNTRY': this.stprMain.value.ddlCountry > 0 ? this.stprMain.value.ddlCountry : null,
        'MMM_CHURCH': this.stprMain.value.ddlChurch,
        'MMM_MEMBER': this.stprMain.value.ddlMember,
      
       };
      this.getMemberList(this.getmemberlistrequest);
      this.enableSearch = false;
      this.enableAll = true;
    }
    getAllMembers(): void{
        this.pageNo = 1;
        this.disableprev = true;
        this.getmemberlistrequest = {
            'PAGE_NO': this.pageNo,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
            'MMM_CENTRE': null,
            'MMM_REGION': null,
            'MMM_COUNTRY': null,
            'MMM_CHURCH': null,
            'MMM_MEMBER':null
        };
        this.getMemberList(this.getmemberlistrequest);
        this.stprMain.reset();
        this.enableAll = false;
    }


    getFilterFields(ministrylistReq): any {
      this.memberService.getFilterFields(ministrylistReq, this.header).subscribe((data: Array<object>) => {
      this.filterFields = data['Data'];
      this.countryID=this.filterFields[0].CNT_PK;
      this.regionID=this.filterFields[0].RGN_PK;
      this.centreID=this.filterFields[0].CTR_PK;
      this.churchID=this.filterFields[0].CCH_PK;

      this.pageNo = 1;
      this.disableprev = true;
      

      this.getmemberlistrequest = {
         'PAGE_NO':  this.pageNo,
         'PAGE_SIZE' : this.GlobalUrls.pageSize,
         'USER_PK': 1,
         'MMM_CENTRE':this.centreID,
         'MMM_REGION': this.regionID,
         'MMM_COUNTRY': this.countryID,
         'MMM_CHURCH': this.churchID,
         'MMM_MEMBER':''
      };
     console.log(this.getmemberlistrequest);
       this.getMemberList(this.getmemberlistrequest);
    
      });
    }
    


    onCountrySelect(): any {
        this.makesearch = true;
        this.stprMain.controls.ddlRegion.reset();
        this.stprMain.controls.ddlCentre.reset();
        this.stprMain.controls.ddlChurch.reset();
        this.filteredRegion.next([]);
        this.filteredCentre.next([]);
        this.filteredChurch.next([]);
     
        this.regionrequest = {
                                'RGN_COUNTRY':  this.stprMain.value.ddlCountry
                              };
       this.apiService.getRegion(this.regionrequest, this.header).subscribe((data: Array<object>) => {
        this.regiondata = data['Data'];
        // this.regiondata.splice(0,0,this.searchDataNull);
        if (this.regiondata != null) {
        this.filteredRegion.next(this.regiondata.slice());
       }
      });
       
    }
    onRegionSelect(): void {
        
        this.stprMain.controls.ddlCentre.reset();
        this.stprMain.controls.ddlChurch.reset();
        this.filteredCentre.next([]);
        this.filteredChurch.next([]);
        
        this.centrerequest = {
                                'CTR_REGION':  this.stprMain.value.ddlRegion
                             };
       this.apiService.getCentre(this.centrerequest,  this.header).subscribe((data: Array<object>) => {
        this.centredata = data['Data'];
        if (this.centredata != null) {
          this.filteredCentre.next(this.centredata.slice());
        }
      });
    
    }
    onCentreSelect(): void {
        this.stprMain.controls.ddlChurch.reset();
        this.filteredChurch.next([]);
       
        this.churchrequest = {
                                  'CCH_CENTRE': this.stprMain.value.ddlCentre
                              };
     
       this.apiService.getChurch(this.churchrequest,  this.header).subscribe((data: Array<object>) => {
        this.churchdata = data['Data'];
        if (this.churchdata != null) {
          this.filteredChurch.next(this.churchdata.slice());
        }
      });
     
    } 

    onChurchSelect(): void {
   
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

    private filterMember(): void {

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
             this.filteredMember.next(this.members);
         });





         
     
  }
    closeFun(): any {
        this.enableSearch = false;
        this.stprMain.reset();
        this.stprMain.value.ddlMember.reset();
        this.pageNo = 1;
       this.disableprev = true;
       this.getmemberlistrequest = {
        'PAGE_NO':  this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': null,
        'MMM_REGION': null,
        'MMM_COUNTRY': null,
        'MMM_CHURCH': null,
        'MMM_MEMBER': null
       };
      this.getMemberList(this.getmemberlistrequest);
    }
    checkcountryselection(): void {
        if (this.stprMain.value.ddlCountry === '') {
           alert('Please Select the country');
        }
       }
       checkCntryandRegselection(): void {
           if (this.stprMain.value.ddlCountry === '' && this.stprMain.value.ddlRegion === '' ) {
               alert('Please Select the Country and Region');
            }else if (this.stprMain.value.ddlRegion === '') {
               alert('Please Select the Region');
            } 
       }


       checkCntryRegandCtrselection(): void {
        if (this.stprMain.value.ddlCountry === '' && this.stprMain.value.ddlRegion === '' && this.stprMain.value.ddlCentre === '' ) {
            alert('Please Select the Country and Region and centre');
         }
         else if (this.stprMain.value.ddlRegion === '' && this.stprMain.value.ddlCentre === '' ) {
          alert('Please Select the Region and Centre');
       } else if (this.stprMain.value.ddlRegion === '') {
            alert('Please Select the Region');
         } 
    }

       
       checkrequiredfields(): void {
           if (this.stprMain.value.ddlCountry === '' && this.stprMain.value.ddlRegion === '' && this.stprMain.value.ddlCentre === ''  ) {
               alert('Please Select the Country,Region and Centre first');
            }else if (this.stprMain.value.ddlRegion === '' && this.stprMain.value.ddlCentre === ''  ) {
               alert('Please Select the Region and Centre ');
            }else if (this.stprMain.value.ddlCentre === '') {
               alert('Please Select the Centre ');
            } 
          
       }
       forEdit(value): any {
           console.log(value);
       this.getRecordReq = {
           'REC_PK': value['MMM_PK']

       };
       this.header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
       this.memberService.getRecordDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
        this.currMem = data['Data'][0];
        // console.log('value');
        // console.log(this.currMem);
        this.editService.changeMember(this.currMem);
         this.editService.currentMember.subscribe(message => {
            this.currMem = message;
            console.log(this.currMem);
        });
       
    });

         this.router.navigate(['/registration/' +  Type.editMember]);
     }
     forView(value): void {
        this.getRecordReq = {
            'REC_PK': value['MMM_PK']
        };
        this.header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
        this.memberService.getRecordDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
         this.currMem = data['Data'][0];
        //  console.log(value);
        //  console.log(this.currMem);

         this.editService.changeMember(this.currMem);
          this.editService.currentMember.subscribe(message => {
             this.currMem = message;
            //  console.log(this.currMem);
         });
        
       });
 
        this.router.navigate(['/registration/' +  Type.viewMemberDetails]);
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
                this.memberService.getRecordDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
                 this.currMem = data['Data'][0];
                 const deleteReq = {
                    'REC_PK': this.currMem['MMM_PK'],
                    'LAST_MOD_DT': this.currMem['LAST_MOD_DT']
                };
                console.log(deleteReq);
                
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
                                this.getmemberlistrequest = {
                                    'PAGE_NO': 1,
                                    'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                    'USER_PK': 1,
                                    'MMM_CENTRE': null,
                                    'MMM_REGION': null,
                                    'MMM_COUNTRY': null,
                                    'MMM_CHURCH': null,
                                    'MMM_MEMBER':null
                                };
                                
                                this.getMembers();
                               
                            }
                            this.DialogRef = null;
                      });
                }else{
                    this.DialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
                    if (res['Data'] == 0){
                        this.DialogRef.componentInstance.Message = 'Already assigned cannot Delete';
                    console.log(res);
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
                            this.getmemberlistrequest = {
                                'PAGE_NO': 1,
                                'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                'USER_PK': 1,
                                'MMM_CENTRE': null,
                                'MMM_REGION': null,
                                'MMM_COUNTRY': null,
                                'MMM_CHURCH': null,
                                'MMM_MEMBER':null
                            };
                            this.getMembers();
                           
                        }
                        this.DialogRef = null;
                  });
                }
                })
              //  this._contactsService.deleteContact(contact);
            });
            this.confirmDialogRef = null;
        }
        });
    }
    addmembernav(): void {
        this.router.navigate(['/registration/' + Type.Member] );
    }
    toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}
}
  

