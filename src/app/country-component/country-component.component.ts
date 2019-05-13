import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { MemberService } from '../services/member/member.service';
import { ApiService } from '../services/common/common.service';
import {CommonEditService} from '../services/common/edit.service';
import {CommonDataObject} from '../services/common/commonDataObject';
import { EditService } from '../services/member/edit.service';
import {AuthService} from '../authentication/auth.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import {Type} from '../utility/type';
import {DialogComponent} from '../dialog/dialog.component';
import {CountryModel} from '../business-object/countrybo';
@Component({
  selector: 'app-country-component',
  templateUrl: './country-component.component.html',
  styleUrls: ['./country-component.component.scss', '../scss/listing.scss', '../scss/settingbutton.scss']
})
export class CountryComponentComponent implements OnInit {
    displayedColumns: string[] = ['ID', 'Name','Edit'];
    dataSource: MatTableDataSource<CountryModel>;
    enableSearch: Boolean = false;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DialogRef: MatDialogRef<DialogComponent>;
    pageNo = 1;
    searchForm: FormGroup;
    countrylistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
      
    };
    getRecordReq = {};
    countrylist: CountryModel[];
    countires: Array<object>;
    regionrequest = {};
    regiondata: any;
    centrerequest: any = {};
    centredata: any;
    currChurch: any;
    currentCouncil = {};
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    makesearch: Boolean = false;
    enableAll: Boolean = false;
    currentRegion: any;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    @ViewChild(MatSort) sort: MatSort;
    public countryFilterCtrl: FormControl = new FormControl();
    public regionFilterCtrl: FormControl = new FormControl();
    public centreFilterCtrl: FormControl = new FormControl();
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredCentre: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private memberService: MemberService,
    private editService: EditService,
    private authService: AuthService,
    public _matDialog: MatDialog,
    private commonEditService: CommonEditService,
    private CommondataObject: CommonDataObject,
    private _fuseSidebarService: FuseSidebarService,
    private router: Router,
    private GlobalUrls: GlobalUrl,private commoneditService: CommonEditService,) { 
      //  this.getChurchList(this.churchlistrequest);
      this.getcountriesList();
    }

  ngOnInit(): void {
    this.editService.changeMember(this.editService.member);
    this.commonEditService.changeChurch(this.CommondataObject.church);
    this.searchForm = this._formBuilder.group({
        ddlCountry: [null],
        ddlRegion: [null],
        ddlCentre: [null]
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

getcountriesList(): any {
    this.apiService.getCountryList( this.header).subscribe((data: Array<object>) => {
      this.countrylist = data['Data'];
      console.log('this.countrylist');
      console.log(this.countrylist);
      this.dataSource = new MatTableDataSource(this.countrylist);
  });


}

  getCountries(): any {
    this.apiService.getCountry(this.header).subscribe((data: Array<object>) => {
        this.countires = data['Data'];
        this.filteredCount.next(this.countires.slice());
  });
}


forcountrydrill(value): any {
   this.router.navigate(['/regionlist/',value['CNT_PK']]);
}

applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  register(): any {
      this.enableSearch = true;
  }

 

  onCountrySelect(): any {
    this.makesearch = true;
    this.searchForm.controls.ddlRegion.reset();
    this.searchForm.controls.ddlCentre.reset();
    this.filteredRegion.next([]);
    this.filteredCentre.next([]);
     this.regionrequest = {
                   'RGN_COUNTRY': this.searchForm.value.ddlCountry
               };
  
   this.apiService.getRegion(this.regionrequest, this.header).subscribe((data: Array<object>) => {
   this.regiondata = data['Data'];
    if (this.regiondata != null) {
    this.filteredRegion.next(this.regiondata.slice());
   }
  });
   
}
onRegionSelect(): void {
    
    this.searchForm.controls.ddlCentre.reset();
    this.filteredCentre.next([]);
    this.centrerequest = {
                   'CTR_REGION': this.searchForm.value.ddlRegion
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
    if (this.searchForm.value.ddlCountry === '') {
       alert('Please Select the country');
    }
   }
   checkCntryandRegselection(): void {
       if (this.searchForm.value.ddlCountry === '' && this.searchForm.value.ddlRegion === '' ) {
           alert('Please Select the Country and Region');
        }else if (this.searchForm.value.ddlRegion === '') {
           alert('Please Select the Region');
        } 
   }
   checkrequiredfields(): void {
       if (this.searchForm.value.ddlCountry === '' && this.searchForm.value.ddlRegion === '' && this.searchForm.value.ddlCentre === '') {
           alert('Please Select the Country,Region and Centre first');
        }else if (this.searchForm.value.ddlRegion === '' && this.searchForm.value.ddlCentre === '') {
           alert('Please Select the Region and Centre');
        }else if (this.searchForm.value.ddlCentre === '') {
           alert('Please Select the Centre');
        } 
   }
   
  

addChurchnav(): void {
 this.router.navigate(['/churchregistration'] );
}
toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}
nextPage()
{}
previousPage()
{

}
enbleSearch()
{}

}
