import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/common/common.service';
import {AuthService} from '../authentication/auth.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-print-cntr',
  templateUrl: './print-cntr.component.html',
  styleUrls: ['./print-cntr.component.scss', '../scss/bootstrap.min.scss', '../scss/print.scss']
})
export class PrintCntrComponent implements OnInit {
    regionlist: any; 
  pageNo = 1;
  searchForm: FormGroup;
  disableprev: Boolean = true;
  disablenext: Boolean = true;
  makesearch: Boolean = false;
  enableSearch: Boolean = false;
  enableAll: Boolean = false;
  confirmDialogRef: MatDialogRef<DialogComponent>;
  centrelistrequest = {
    'PAGE_NO': 1,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'CTR_REGION': null,
    'CTR_COUNTRY': null
};
  centrelist: any; 
  regiondata: any;
  regionrequest = {};
  countires: Array<object>;
  header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } }; 
  public countryFilterCtrl: FormControl = new FormControl();
  public regionFilterCtrl: FormControl = new FormControl();
  public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  constructor(private apiService: ApiService,
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private GlobalUrls: GlobalUrl) {
        this.getCentreList();
     }

  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
        country: [''],
        region: [''],
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
  }
  getCentreList(): any {
    this.apiService.getCentreList(this.centrelistrequest, this.header).subscribe((data: Array<object>) => {
        this.centrelist = data['Data'];
      
    });
    this.centrelistrequest = {
        'PAGE_NO':  this.pageNo + 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'CTR_REGION': null,
        'CTR_COUNTRY': null
    };
    this.apiService.getCentreList(this.centrelistrequest, this.header).subscribe((data: Array<object>) => {
        if (data['Data'] === null) {
           this.disablenext = true;
        }else {
            this.disablenext = false;  
        }
    });
}
getCentres(reqbody): void {
    this.apiService.getCentreList(reqbody, this.header).subscribe((data: Array<object>) => {
        this.centrelist = data['Data'];

    });
    reqbody = {
        'PAGE_NO':  this.pageNo + 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'CTR_REGION': this.searchForm.value.region,
        'CTR_COUNTRY': this.searchForm.value.country
    };
    this.apiService.getCentreList(reqbody, this.header).subscribe((data: Array<object>) => {
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
onCountrySelect(): any {
    this.makesearch = true;
    this.searchForm.controls.region.reset();
    this.filteredRegion.next([]);
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
getAllCentres(): void{
    this.pageNo = 1;
    this.disableprev = true;
    this.centrelistrequest = {
        'PAGE_NO': this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'CTR_REGION': null,
       'CTR_COUNTRY': null
    };
    this.getCentres(this.centrelistrequest);
    this.searchForm.reset();
    this.enableAll = false;
}
nextPage(): any {
         
    this.pageNo += 1;
    this.disableprev = false;
    this.centrelistrequest = {
        'PAGE_NO':  this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'CTR_REGION': this.searchForm.value.region,
        'CTR_COUNTRY': this.searchForm.value.country
        
    };
   this.getCentres(this.centrelistrequest);
}
previousPage(): any {
    this.pageNo -= 1;
    this.disablenext = false;
    if (this.pageNo < 2) {
      this.disableprev = true; 
    }
    this.centrelistrequest = {
        'PAGE_NO':  this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'CTR_REGION': this.searchForm.value.region,
        'CTR_COUNTRY': this.searchForm.value.country
    };
    this.getCentres(this.centrelistrequest);
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
filterCentres(): void {
    this.pageNo = 1;
    this.disableprev = true;
    this.centrelistrequest = {
       'PAGE_NO':  this.pageNo,
       'PAGE_SIZE' : this.GlobalUrls.pageSize,
       'USER_PK': 1,
       'CTR_REGION': this.searchForm.value.region,
       'CTR_COUNTRY': this.searchForm.value.country
    };
     this.enableSearch = false;
     this.getCentres(this.centrelistrequest);
     this.enableAll = true;
  }
  enbleSearch(): any {
    this.enableSearch = true;
     this.makesearch = false;
 }
 printFunction(): void{
    window.print();
  }
closeFun(): any {
    this.enableSearch = false;
    this.searchForm.reset();
    
}
checkcountryselection(): void {
    if (this.searchForm.value.country === '' || this.searchForm.value.country === null ) {
    //    alert('Please Select the country');
    this.confirmDialogRef = this._matDialog.open(DialogComponent, {
        disableClose: true
    });
    this.confirmDialogRef.componentInstance.Message = 'Please Select the country';
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

