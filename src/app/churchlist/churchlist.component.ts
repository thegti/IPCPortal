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
import { Router,ActivatedRoute } from '@angular/router';
import {Type} from '../utility/type';
import {DialogComponent} from '../dialog/dialog.component';
import {ChurchModel} from '../business-object/churchbo';
import {FilterFields} from '../business-object/memberbo';
@Component({
  selector: 'app-churchlist',
  templateUrl: './churchlist.component.html',
  styleUrls: ['./churchlist.component.scss', '../scss/listing.scss', '../scss/settingbutton.scss']
})
export class ChurchlistComponent implements OnInit {
    displayedColumns: string[] = ['ID', 'Name', 'President', 'Mobile','CCH_EMAIL', 'Edit'];
    dataSource: MatTableDataSource<ChurchModel>;
    enableSearch: Boolean = false;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DialogRef: MatDialogRef<DialogComponent>;
    pageNo = 1;
    searchForm: FormGroup;
    churchlistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'CCH_CENTRE': null,
        'CCH_REGION': null,
        'CCH_COUNTRY': null
    };
    countryID:any;
    regionID:any;
    centreID:any;
    getRecordReq = {};
    churchlist: ChurchModel[];
    countires: Array<object>;
    regionrequest = {};
    regiondata: any;
    centrerequest: any = {};
    centredata: any;
    ChurchID:any;
    currChurch: any;
    currentCouncil = {};
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    makesearch: Boolean = false;
    enableAll: Boolean = false;
    filterFields: FilterFields; 
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
    private GlobalUrls: GlobalUrl,private act_route: ActivatedRoute) { 
      //  this.getChurchList(this.churchlistrequest);
     // this.getChurchList();
    }

  ngOnInit(): void {
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

        if(params['centreID']!=null){
          this.centreID = params['centreID'];
          if(this.countryID==0)
          this.getFilterFields({"CTR_PK": this.centreID});
        
        }
        else
        this.centreID=0;

        if(this.countryID>0 && this.regionID>0 && this.centreID>0)
        {
          this.pageNo = 1;
          this.disableprev = true;
          this.churchlistrequest = {
          'PAGE_NO':  this.pageNo,
          'PAGE_SIZE' : this.GlobalUrls.pageSize,
          'USER_PK': 1,
          'CCH_CENTRE': this.centreID,
          'CCH_REGION': this.regionID,
          'CCH_COUNTRY': this.countryID
         };
     
       
         this.enableSearch = false;
        this.getChurchs(this.churchlistrequest);
        this.enableAll = true;
        }
        else
        this.getChurchList();
    });
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
  getChurchs(churchreq): any {
    this.apiService.getChurchList(churchreq,  this.header).subscribe((data: Array<object>) => {
      this.churchlist = data['Data'];
      console.log(this.churchlist);
      this.dataSource = new MatTableDataSource(this.churchlist);
  });
  churchreq = {
    'PAGE_NO':  this.pageNo + 1,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'CCH_CENTRE': this.centreID >0 ?  +this.centreID : this.searchForm.value.ddlCentre,
    'CCH_REGION': this.regionID >0 ? +this.regionID : this.searchForm.value.ddlRegion,
    'CCH_COUNTRY': this.countryID >0 ? +this.countryID : this.searchForm.value.ddlCountry
};
this.apiService.getChurchList(churchreq,  this.header).subscribe((data: Array<object>) => {
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
      console.log(this.churchlist);
      this.dataSource = new MatTableDataSource(this.churchlist);
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

forchurchdrill(value): any {
console.log('test');
console.log(value['CCH_PK']);
  this.router.navigate(['/memberlist/',this.countryID,this.regionID,this.centreID,value['CCH_PK']]);
}



getFilterFields(paramReq): any {
  this.memberService.getFilterFields(paramReq, this.header).subscribe((data: Array<object>) => {
  this.filterFields = data['Data'];
  this.countryID=this.filterFields[0].CNT_PK;
  this.regionID=this.filterFields[0].RGN_PK;
  this.pageNo = 1;
  this.disableprev = true;
  this.churchlistrequest = {
     'PAGE_NO':  this.pageNo,
     'PAGE_SIZE' : this.GlobalUrls.pageSize,
     'USER_PK': 1,
     'CCH_CENTRE':this.centreID,
     'CCH_REGION': this.regionID,
     'CCH_COUNTRY': this.countryID
  };
 console.log('this.churchlistrequest' );
 console.log(this.churchlistrequest );
   this.getChurchs(this.churchlistrequest);

  });
}



  getCountries(): any {
    this.apiService.getCountry(this.header).subscribe((data: Array<object>) => {
        this.countires = data['Data'];
        this.filteredCount.next(this.countires.slice());
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
      this.churchlistrequest = {
          'PAGE_NO':  this.pageNo,
          'PAGE_SIZE' : this.GlobalUrls.pageSize,
          'USER_PK': 1,
          'CCH_CENTRE': this.centreID>0 ? this.centreID: this.searchForm.value.ddlCentre,
          'CCH_REGION': this.regionID>0 ? this.regionID: this.searchForm.value.ddlRegion,
          'CCH_COUNTRY': this.countryID>0 ? this.countryID: this.searchForm.value.ddlCountry
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
          'CCH_CENTRE': this.centreID>0 ? this.centreID: this.searchForm.value.ddlCentre,
          'CCH_REGION': this.regionID>0 ? this.regionID: this.searchForm.value.ddlRegion,
          'CCH_COUNTRY': this.countryID>0 ? this.countryID: this.searchForm.value.ddlCountry
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
    'CCH_CENTRE': this.searchForm.value.ddlCentre,
    'CCH_REGION': this.searchForm.value.ddlRegion,
    'CCH_COUNTRY': this.searchForm.value.ddlCountry
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
   forEdit(value): any {
   this.getRecordReq = {
    'REC_PK': value['CCH_PK']
   };
   this.apiService.getChurchDetails(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
   this.currChurch = data['Data'][0];
   this.commonEditService.changeChurch(this.currChurch);
   this.commonEditService.currentChurch.subscribe(message => {
     this.currChurch = message;
     console.log(this.currChurch);
 });

});
 this.router.navigate(['/churchregistration/' +  Type.editchurch]);
}
forView(value): void {
   this.getRecordReq = {
       'REC_PK': value['CCH_PK']
   };
   this.apiService.getChurchDetails(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
    this.currChurch = data['Data'][0];
    this.currentCouncil['PRESIDENT_TEXT'] = this.currChurch['CCH_PRESIDENT_TEXT'];
    this.currentCouncil['SECRETARY_TEXT'] = this.currChurch['CCH_SECRETARY_TEXT'];
    this.currentCouncil['TREASURER_TEXT'] = this.currChurch['CCH_TREASURER_TEXT'];
    this.currentCouncil['VICE_PRESIDENT1_TEXT'] = this.currChurch['CCH_VICE_PRESIDENT1_TEXT'];
    this.currentCouncil['VICE_PRESIDENT2_TEXT'] = this.currChurch['CCH_VICE_PRESIDENT2_TEXT'];
    this.currentCouncil['JOINT_SECRETARY1_TEXT'] = this.currChurch['CCH_JOINT_SECRETARY1_TEXT'];
    this.currentCouncil['JOINT_SECRETARY2_TEXT'] = this.currChurch['CCH_JOINT_SECRETARY2_TEXT'];
    this.currentCouncil['PRESIDENT_PHOTO'] = this.currChurch['CCH_PRESIDENT_PHOTO'];
    this.currentCouncil['SECRETARY_PHOTO'] = this.currChurch['CCH_SECRETARY_PHOTO'];
    this.currentCouncil['TREASURER_PHOTO'] = this.currChurch['CCH_TREASURER_PHOTO'];
    this.currentCouncil['VICE_PRESIDENT1_PHOTO'] = this.currChurch['CCH_VICE_PRESIDENT1_PHOTO'];
    this.currentCouncil['VICE_PRESIDENT2_PHOTO'] = this.currChurch['CCH_VICE_PRESIDENT2_PHOTO'];
    this.currentCouncil['JOINT_SECRETARY1_PHOTO'] = this.currChurch['CCH_JOINT_SECRETARY1_PHOTO'];
    this.currentCouncil['JOINT_SECRETARY2_PHOTO'] = this.currChurch['CCH_JOINT_SECRETARY2_PHOTO'];
    this.commonEditService.changeChurch(this.currChurch);
    this.commonEditService.changeCouncil(this.currentCouncil);
    this.commonEditService.currentCouncil.subscribe((datas) => {console.log(datas); });




    
  });

   this.router.navigate(['/churchregistration/' +  Type.viewChurch]);
}
forDelete(value): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
            this.getRecordReq = {
                'REC_PK': value['CCH_PK']
            };
            this.apiService.getChurchDetails(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
             this.currChurch = data['Data'][0];
            console.log(this.currChurch);
            const deleteReq = {
                'REC_PK': this.currChurch['CCH_PK'],
                'LAST_MOD_DT': this.currChurch['LAST_MOD_DT']
            };
            this.apiService.deleteChurch(deleteReq, this.header).subscribe((res: Array<object>) => {
                console.log(res);
                if (res['Data'] > 0) {
                    this.DialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
            
                    this.DialogRef.componentInstance.Message = 'Record Deleted Successfully';
            
                    this.DialogRef.afterClosed().subscribe(results => {
                        if ( results )
                        {
                            this.churchlistrequest = {
                                'PAGE_NO': 1,
                                'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                'USER_PK': 1,
                                'CCH_CENTRE': null,
                                'CCH_REGION': null,
                                'CCH_COUNTRY': null
                            };
                            this.getChurchList();
                           
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
                        this.churchlistrequest = {
                            'PAGE_NO': 1,
                            'PAGE_SIZE' : this.GlobalUrls.pageSize,
                            'USER_PK': 1,
                            'CCH_CENTRE': null,
                            'CCH_REGION': null,
                            'CCH_COUNTRY': null
                        };
                        this.getChurchList();
                       
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
addChurchnav(): void {
 this.router.navigate(['/churchregistration'] );
}
toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}
}
