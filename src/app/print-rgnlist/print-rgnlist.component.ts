import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/common/common.service';
import {AuthService} from '../authentication/auth.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-print-rgnlist',
  templateUrl: './print-rgnlist.component.html',
  styleUrls: ['./print-rgnlist.component.scss', '../scss/bootstrap.min.scss', '../scss/print.scss']
})
export class PrintRgnlistComponent implements OnInit {
  regionlist: any; 
  pageNo = 1;
  searchForm: FormGroup;
  disableprev: Boolean = true;
  disablenext: Boolean = true;
  makesearch: Boolean = false;
  enableSearch: Boolean = false;
  enableAll: Boolean = false;
  regionlistrequest = {
    'PAGE_NO': 1,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'RGN_COUNTRY': null
};
  countires: Array<object>;
  header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } }; 
  public countryFilterCtrl: FormControl = new FormControl();
  public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  constructor( private apiService: ApiService,
               private authService: AuthService,
               private _formBuilder: FormBuilder,
               private GlobalUrls: GlobalUrl) { }

  ngOnInit(): void {
      this.getRegions();
      this.getCountries();

      this.searchForm = this._formBuilder.group({
        country: [null],
    });
    this.countryFilterCtrl.valueChanges
    .subscribe(() => {
      this.filterCounts();
    });
  }
  getRegions(): void {
    this.apiService.getRegionList(this.regionlistrequest, this.header).subscribe((data: Array<object>) => {
        this.regionlist = data['Data'];
    });
    this.regionlistrequest = {
      'PAGE_NO':  this.pageNo + 1,
      'PAGE_SIZE' : this.GlobalUrls.pageSize,
      'USER_PK': 1,
      'RGN_COUNTRY': null
  };
  this.apiService.getRegionList( this.regionlistrequest, this.header ).subscribe((data: Array<object>) => {
      if (data['Data'] === null) {
         this.disablenext = true;
      }else {
        this.disablenext = false;
      }
  });  
 }
  getRegionList(regReq): any {
    this.apiService.getRegionList(regReq, this.header).subscribe((data: Array<object>) => {
      this.regionlist = data['Data'];
     // this.dataSource = new MatTableDataSource(this.regionlist);
  });
  regReq = {
    'PAGE_NO':  this.pageNo + 1,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'RGN_COUNTRY': this.searchForm.value.country
};
this.apiService.getRegionList( regReq, this.header ).subscribe((data: Array<object>) => {
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
getAllRegions(): void{
    this.pageNo = 1;
    this.disableprev = true;
    this.regionlistrequest = {
        'PAGE_NO': this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'RGN_COUNTRY': null,
    };
    this.getRegionList(this.regionlistrequest);
    this.searchForm.reset();
    this.enableAll = false;
}
nextPage(): any {
         
    this.pageNo += 1;
    this.disableprev = false; 
    this.regionlistrequest = {
        'PAGE_NO':  this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'RGN_COUNTRY': this.searchForm.value.country
    };
    this.getRegionList(this.regionlistrequest);
}
previousPage(): any {
    this.pageNo -= 1;
    this.disablenext = false;
    if (this.pageNo < 2) {
      this.disableprev = true; 
    }
    this.regionlistrequest = {
        'PAGE_NO':  this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'RGN_COUNTRY': this.searchForm.value.country
    };
    this.getRegionList(this.regionlistrequest);
} 
enbleSearch(): any {
   this.enableSearch = true;
    this.makesearch = false;
}
filterRegion(): void {
    this.pageNo = 1;
    this.disableprev = true;
    this.regionlistrequest = {
       'PAGE_NO':  this.pageNo,
       'PAGE_SIZE' : this.GlobalUrls.pageSize,
       'USER_PK': 1,
       'RGN_COUNTRY': this.searchForm.value.country
    };
     this.enableSearch = false;
     this.getRegionList(this.regionlistrequest);
     this.enableAll = true;
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
 printFunction(): void{
    window.print();
  }
  closeFun(): any {
    this.enableSearch = false;
    this.searchForm.reset();
    
}
print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
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
// <body onload="window.print();window.close()">${printContents}</body>