import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/common/common.service';
import { MemberService } from '../services/member/member.service';
import {AuthService} from '../authentication/auth.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import {User} from '../authentication/user.model';
@Component({
  selector: 'app-prnt-member',
  templateUrl: './prnt-member.component.html',
  styleUrls: ['./prnt-member.component.scss', '../scss/bootstrap.min.scss', '../scss/print.scss']
})
export class PrntMemberComponent implements OnInit {
    memberlist: any; 
    pageNo = 1;
    searchForm: FormGroup;
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    makesearch: Boolean = false;
    enableSearch: Boolean = false;
    enableAll: Boolean = false;
    confirmDialogRef: MatDialogRef<DialogComponent>;
    getmemberlistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': null,
        'MMM_REGION': null,
        'MMM_COUNTRY': null,
        'MMM_CHURCH': null
    };
    regionrequest = {};
    regiondata: any;
    centrerequest: any = {};
    centredata: any;
    churchrequest: any = {};
    churchdata: any;
    countires: Array<object>;
    user: User;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } }; 
    public countryFilterCtrl: FormControl = new FormControl();
    public regionFilterCtrl: FormControl = new FormControl();
    public centreFilterCtrl: FormControl = new FormControl();
    public churchFilterCtrl: FormControl = new FormControl();
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredCentre: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredChurch: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1); 
    constructor(private apiService: ApiService,
        private memberService: MemberService,
      private _formBuilder: FormBuilder,
      public _matDialog: MatDialog,
      private authService: AuthService,
      private GlobalUrls: GlobalUrl) {
        this.getMembers();
       }
  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
        country: [null],
        region: [null],
        centre: [null],
        church: [null],
    });
     
  this.getCountries();

  this.countryFilterCtrl.valueChanges
  .subscribe(() => {
    this.filterCounts();
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
    
}
getMembers(): void {
    this.user = this.authService.getUser();
    this.memberService.getMemberpageList(this.getmemberlistrequest , this.header).subscribe((data: Array<object>) => {
        this.memberlist = data['Data'];
        console.log(this.memberlist);
    });
    this.getmemberlistrequest = {
        'PAGE_NO':  this.pageNo + 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': null,
        'MMM_REGION': null,
        'MMM_COUNTRY': null,
        'MMM_CHURCH': null
    };
    this.memberService.getMemberpageList(this.getmemberlistrequest,  this.header).subscribe((data: Array<object>) => {
        if (data['Data'] === null) {
           this.disablenext = true;
        }else {
            this.disablenext = false;  
        }
    }); 
}
getMemberList(memberlistReq): any {
  this.memberService.getMemberpageList(memberlistReq,  this.header).subscribe((data: Array<object>) => {
    this.memberlist = data['Data'];
   });
   memberlistReq = {
    'PAGE_NO':  this.pageNo + 1,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'MMM_CENTRE': this.searchForm.value.centre,
    'MMM_REGION': this.searchForm.value.region,
    'MMM_COUNTRY': this.searchForm.value.country,
    'MMM_CHURCH': this.searchForm.value.church
   };
   this.memberService.getMemberpageList(memberlistReq,  this.header).subscribe((data: Array<object>) => {
    if (data['Data'] === null) {
       this.disablenext = true;
    }else {
        this.disablenext = false;  
    }
});
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
        'MMM_CENTRE': this.searchForm.value.centre,
        'MMM_REGION': this.searchForm.value.region,
        'MMM_COUNTRY': this.searchForm.value.country,
        'MMM_CHURCH': this.searchForm.value.church
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
        'MMM_CENTRE': this.searchForm.value.centre,
        'MMM_REGION': this.searchForm.value.region,
        'MMM_COUNTRY': this.searchForm.value.country,
        'MMM_CHURCH': this.searchForm.value.church
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
filterMembers(): void {
    this.pageNo = 1;
    this.disableprev = true;
   this.getmemberlistrequest = {
    'PAGE_NO':  this.pageNo,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'MMM_CENTRE': this.searchForm.value.centre,
    'MMM_REGION': this.searchForm.value.region,
    'MMM_COUNTRY': this.searchForm.value.country,
    'MMM_CHURCH': this.searchForm.value.church
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
        'MMM_CHURCH': null
    };
    this.getMemberList(this.getmemberlistrequest);
    this.searchForm.reset();
    this.enableAll = false;
}
onCountrySelect(): any {
    this.makesearch = true;
    this.searchForm.controls.region.reset();
    this.searchForm.controls.centre.reset();
    this.searchForm.controls.church.reset();
    this.filteredRegion.next([]);
    this.filteredCentre.next([]);
    this.filteredChurch.next([]);
    this.regionrequest = {
                            'RGN_COUNTRY':  this.searchForm.value.country
                          };
   this.apiService.getRegion(this.regionrequest, this.header).subscribe((data: Array<object>) => {
    this.regiondata = data['Data'];
    if (this.regiondata != null) {
    this.filteredRegion.next(this.regiondata.slice());
   }
  });
   
}
onRegionSelect(): void {
    
    this.searchForm.controls.centre.reset();
    this.searchForm.controls.church.reset();
    this.filteredCentre.next([]);
    this.filteredChurch.next([]);
    this.centrerequest = {
                            'CTR_REGION':  this.searchForm.value.region
                         };
   this.apiService.getCentre(this.centrerequest,  this.header).subscribe((data: Array<object>) => {
    this.centredata = data['Data'];
    if (this.centredata != null) {
      this.filteredCentre.next(this.centredata.slice());
    }
  });

}
onCentreSelect(): void {
    this.searchForm.controls.church.reset();
    this.filteredChurch.next([]);
    this.churchrequest = {
                              'CCH_CENTRE': this.searchForm.value.centre
                          };
 
   this.apiService.getChurch(this.churchrequest,  this.header).subscribe((data: Array<object>) => {
    this.churchdata = data['Data'];
    if (this.churchdata != null) {
      this.filteredChurch.next(this.churchdata.slice());
    }
  });
 
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
printFunction(): void{
    window.print();
}
closeFun(): any {
    this.enableSearch = false;
    this.searchForm.reset();
    
}
checkcountryselection(): void {
    if (this.searchForm.value.country === '' ||  this.searchForm.value.country === null)  {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.Message = 'Please Select Country';
    }
   }
   checkCntryandRegselection(): void {
       if ((this.searchForm.value.country === '' ||  this.searchForm.value.country === null) && (this.searchForm.value.region === '' || this.searchForm.value.region === null)) {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.Message = 'Please Select Country and Region';
        }else if (this.searchForm.value.region === '' || this.searchForm.value.region === null) {
            this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                disableClose: true
            });
            this.confirmDialogRef.componentInstance.Message = 'Please Select Region';
        } 
   }
   checkrequiredfields(): void {
       if ((this.searchForm.value.country === '' ||  this.searchForm.value.country === null) &&
           (this.searchForm.value.region === '' || this.searchForm.value.region === null) &&
           ( this.searchForm.value.centre === '' ||  this.searchForm.value.centre === null)) {
           this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.Message = 'Please Select the Country,Region and Centre first';
        }else if ( (this.searchForm.value.region === '' || this.searchForm.value.region === null) &&
                   (this.searchForm.value.centre === '' ||  this.searchForm.value.centre === null)) {
           this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
           });
           this.confirmDialogRef.componentInstance.Message = 'Please Select the Region and Centre';
        }else if (this.searchForm.value.centre === '' ||  this.searchForm.value.centre === null) {
           this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
           });
           this.confirmDialogRef.componentInstance.Message = 'Please Select the Centre';
        } 
   }
print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
 //   popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <style>
         div.table-responsive{
             width:100%;
         }
         .tbcls{
            width: 80%;
            display: table;
            margin-left: 10%;
         }
         .table td,.table th{
             padding:.75rem;
             vertical-align:top;
             border-top:1px solid #dee2e6;
        }
         tbody{
            text-align: center;
         }
            </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
  //  popupWin.document.write();
    popupWin.document.close();
}
}
