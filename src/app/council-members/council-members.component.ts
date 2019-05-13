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

import {DialogComponent} from '../dialog/dialog.component';
import {ChurchModel} from '../business-object/churchbo';
import {Contact} from '../../app/council-members/contact.model';
import {Type} from '../utility/type';
import { environment } from 'environments/environment';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';
import { GeneralCouncilModel } from 'app/business-object/memberbo';
@Component({
  selector: 'app-council-members',
  templateUrl: './council-members.component.html',
  styleUrls: ['./council-members.component.scss', '../scss/listing.scss', '../scss/settingbutton.scss']
})
export class CouncilMembersComponent implements OnInit {
  baseUrl = environment.baseUrl + this.GlobalUrls.MemberImgFolder;
  
  contacts: any;
  user: any;

  dataSource: MatTableDataSource<GeneralCouncilModel>;
  
  displayedColumns: string[] = ['MMM_PHOTO','MMM_NAME1','MMM_REGION_NAME','MMM_CENTRE_NAME','MMM_CHURCH_NAME'];
  selectedContacts: any[];


  enableSearch: Boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  DialogRef: MatDialogRef<DialogComponent>;
  pageNo = 1;
  searchForm: FormGroup;
  churchlistrequest = {
      'PAGE_NO': 1,
      'PAGE_SIZE' : 200,
      'USER_PK': 1,
      'CCH_CENTRE': null,
      'CCH_REGION': null,
      'CCH_COUNTRY': null
  };
  councillistrequest = {
    'PAGE_NO': 1,
    'PAGE_SIZE' : this.GlobalUrls.pageSize,
    'USER_PK': 1,
    'ACTIVE': 1,
  
};
  getRecordReq = {};
  churchlist: ChurchModel[];
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
  presidentcntrl: FormControl;
  
  secretary: FormControl = new FormControl();
  treasurer: FormControl = new FormControl();
  vicpres1: FormControl = new FormControl();
  vicpres2: FormControl = new FormControl();
  joinsec: FormControl = new FormControl();
  imgsrc = [];
  council: GeneralCouncilModel[];
  members: any;
  public defaultImg: String;
  header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
  @ViewChild(MatSort) sort: MatSort;
  public countryFilterCtrl: FormControl = new FormControl();
  public regionFilterCtrl: FormControl = new FormControl();
  public centreFilterCtrl: FormControl = new FormControl();
  public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  public filteredCentre: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  private _unsubscribeAll: Subject<any>;
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
  private GlobalUrls: GlobalUrl) { 
    //  this.getChurchList(this.churchlistrequest);
  
    this._unsubscribeAll = new Subject();
    this.defaultImg="display-img.jpg";
  }

ngOnInit(): void {
  this.getGeneralCouncil();
  this.editService.changeMember(this.editService.member);
  this.commonEditService.changeChurch(this.CommondataObject.church);
  this.searchForm = this._formBuilder.group({
      ddlCountry: [null],
      ddlRegion: [null],
      ddlCentre: [null]
  });
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
        'CCH_CENTRE': this.searchForm.value.ddlCentre,
        'CCH_REGION': this.searchForm.value.ddlRegion,
        'CCH_COUNTRY': this.searchForm.value.ddlCountry
    };


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
        'CCH_CENTRE': this.searchForm.value.ddlCentre,
        'CCH_REGION': this.searchForm.value.ddlRegion,
        'CCH_COUNTRY': this.searchForm.value.ddlCountry
    };

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

this.enableAll = true;
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

public getGeneralCouncil(): void {
  this.councillistrequest = {
    'PAGE_NO':  this.pageNo ,
    'PAGE_SIZE' : 200,
    'USER_PK': 1,
    'ACTIVE': 1
  };
  this.memberService.getGeneralCouncil(this.councillistrequest, this.header).subscribe((data: Array<object>) => {
    console.log(data);
    this.council = data['Data'];
    console.log( this.council);
    this.dataSource = new MatTableDataSource(this.council);
  });

}


}



