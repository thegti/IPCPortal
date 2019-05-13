import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/common/common.service';
import {AuthService} from '../authentication/auth.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-print-church',
  templateUrl: './print-church.component.html',
  styleUrls: ['./print-church.component.scss', '../scss/bootstrap.min.scss', '../scss/print.scss']
})
export class PrintChurchComponent implements OnInit {
    regionlist: any; 
    pageNo = 1;
    searchForm: FormGroup;
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    makesearch: Boolean = false;
    enableSearch: Boolean = false;
    enableAll: Boolean = false;
    confirmDialogRef: MatDialogRef<DialogComponent>;
    churchlistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'CCH_CENTRE': null,
        'CCH_REGION': null,
        'CCH_COUNTRY': null
    };
    churchlist: any; 
    regiondata: any;
    centrerequest: any = {};
    centredata: any;
    regionrequest = {};
    countires: Array<object>;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } }; 
    public countryFilterCtrl: FormControl = new FormControl();
    public regionFilterCtrl: FormControl = new FormControl();
    public centreFilterCtrl: FormControl = new FormControl();
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredCentre: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    constructor(private apiService: ApiService,
        private authService: AuthService,
      private _formBuilder: FormBuilder,
      public _matDialog: MatDialog,
      private GlobalUrls: GlobalUrl) {
          this.getChurchList();
       }
  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
        country: [null],
        region: [null],
        centre: [null]
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
   
  }
  getChurchs(churchreq): any {
    this.apiService.getChurchList(churchreq,  this.header).subscribe((data: Array<object>) => {
      this.churchlist = data['Data'];
  });
  churchreq = {
    'PAGE_NO':  this.pageNo + 1,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'CCH_CENTRE': this.searchForm.value.centre,
    'CCH_REGION': this.searchForm.value.region,
    'CCH_COUNTRY': this.searchForm.value.country
};
this.apiService.getChurchList(churchreq,  this.header).subscribe((data: Array<object>) => {
    console.log(data['Data']);
    if (data['Data'] === null) {
       this.disablenext = true;
    }else {
        this.disablenext = false;
    }
});
}
getChurchList(): any {
    this.apiService.getChurchList(this.churchlistrequest,  this.header).subscribe((data: Array<object>) => {
      this.churchlist = data['Data'];
  });
  this.churchlistrequest = {
    'PAGE_NO':  this.pageNo + 1,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'CCH_CENTRE': null, // this.searchForm.value.centre,
    'CCH_REGION': null, // this.searchForm.value.region,
    'CCH_COUNTRY': null // this.searchForm.value.country
};
this.apiService.getChurchList(this.churchlistrequest,  this.header).subscribe((data: Array<object>) => {
    if (data['Data'] === null) {
       this.disablenext = true;
    }else {
        this.disablenext = false;
    }
});
}

  getCountries(): any {
    this.apiService.getCountry(this.header).subscribe((data: Array<object>) => {
        this.countires = data['Data'];
        this.filteredCount.next(this.countires.slice());
  });
}

  enbleSearch(): any {  
      this.enableSearch = true;
      this.makesearch = false;
  }
  nextPage(): any {
     
      this.pageNo += 1;
      this.disableprev = false;
      this.churchlistrequest = {
          'PAGE_NO':  this.pageNo,
          'PAGE_SIZE' : this.GlobalUrls.pageSize,
          'USER_PK': 1,
          'CCH_CENTRE': this.searchForm.value.centre,
          'CCH_REGION': this.searchForm.value.region,
          'CCH_COUNTRY': this.searchForm.value.country
      };
     this.getChurchs(this.churchlistrequest);

  }
  previousPage(): any {
      this.pageNo -= 1;
      this.disablenext = false;
      if (this.pageNo < 2) {
        this.disableprev = true; 
      }
      this.churchlistrequest = {
          'PAGE_NO':  this.pageNo,
          'PAGE_SIZE' : this.GlobalUrls.pageSize,
          'USER_PK': 1,
          'CCH_CENTRE': this.searchForm.value.centre,
          'CCH_REGION': this.searchForm.value.region,
          'CCH_COUNTRY': this.searchForm.value.country
      };
    this.getChurchs(this.churchlistrequest);
  } 
  filterChurch(): void {
    this.pageNo = 1;
    this.disableprev = true;
   this.churchlistrequest = {
    'PAGE_NO':  this.pageNo,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'CCH_CENTRE': this.searchForm.value.centre,
    'CCH_REGION': this.searchForm.value.region,
    'CCH_COUNTRY': this.searchForm.value.country
   };
   this.enableSearch = false;
  this.getChurchs(this.churchlistrequest);
  this.enableAll = true;
  }
  getAllChurch(): void{
    this.pageNo = 1;
    this.disableprev = true;
    this.churchlistrequest = {
        'PAGE_NO': this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'CCH_CENTRE': null,
        'CCH_REGION': null,
        'CCH_COUNTRY': null
    };
    this.getChurchs(this.churchlistrequest);
    this.searchForm.reset();
    this.enableAll = false;
}
  onCountrySelect(): any {
    this.makesearch = true;
    this.searchForm.controls.region.reset();
    this.searchForm.controls.centre.reset();
    this.filteredRegion.next([]);
    this.filteredCentre.next([]);
     this.regionrequest = {
                   'RGN_COUNTRY': this.searchForm.value.country
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
    this.filteredCentre.next([]);
    this.centrerequest = {
                   'CTR_REGION': this.searchForm.value.region
               };
    this.apiService.getCentre(this.centrerequest,  this.header).subscribe((data: Array<object>) => {
    this.centredata = data['Data'];
    if (this.centredata != null) {
      this.filteredCentre.next(this.centredata.slice());
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
      // filter the banks
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
      // filter the banks
      this.filteredCentre.next(
        this.centredata.filter(centers => centers['CTR_NAME'].toLowerCase().indexOf(search) > -1)
      );
}
closeFun(): any {
    this.enableSearch = false;
    this.searchForm.reset();
    
}
checkcountryselection(): void {
    if (this.searchForm.value.country === '' ||  this.searchForm.value.country === null) {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.Message = 'Please Select the country';
    }
   }
checkCntryandRegselection(): void {
   
       if ((this.searchForm.value.country === '' || this.searchForm.value.country === null) && (this.searchForm.value.region === '' || this.searchForm.value.region === null ) ) {
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
printFunction(): void{
    window.print();
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
