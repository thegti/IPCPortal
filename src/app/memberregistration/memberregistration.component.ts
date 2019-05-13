import { Component, OnInit , OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ApiService } from '../services/common/common.service';
import { MemberService } from '../services/member/member.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { EditService } from '../services/member/edit.service';
import {AuthService} from '../authentication/auth.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {GlobalUrl} from '../utility/GlobalUrl';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { v4 as uuid } from 'uuid';
import {Type} from '../utility/type';
import {MemberSaveReqModel} from '../business-object/memberbo';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-memberregistration',
  templateUrl: './memberregistration.component.html',
  styleUrls: ['./memberregistration.component.scss', '../scss/form.scss', '../scss/settingbutton.scss']
})
export class MemberregistrationComponent implements OnInit, OnDestroy {
    baseUrl = environment.baseUrl;
 stprPrimary: FormGroup;
 stprSecondary: FormGroup;
 stprTeritary: FormGroup;
 currentMem: any;
 currMem: any;
//  prefixopt = [{ 'prefix': 'Mr', 'value': 1},
//  { 'prefix': 'Sis', 'value': 2}];
 genderopt = [{ 'gender': 'Male', 'value': 1},
              { 'gender': 'Female', 'value': 2}];

 martialtype = [{'status': 'Married', 'value': 1},
                {'status': 'Single', 'value': 2}];
 bldgrp = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
 imgsrc: any = '';
 imagename: any = ''; 
 countires: Array<object> = [];
 title: Array<object> = [];
// country = ['India', 'USA', 'United Kingdom'];
isdate: Boolean = false;
country: any = [];
ddlCountry:any=[];
filteredcountries: Observable<String[]>;
regionrequest = {};
titlerequest = {};
regiondata: any;
regions: any = [];
centrerequest: any = {};
centredata: any;
centers: any = [];
churchrequest: any = {};
churchdata: any;

churchs: any = [];
registerid: any;
regionfieldset: Boolean = true;
// saveRequest: any = {};
saveRequest: MemberSaveReqModel;
selectedfile: File;
imgname: any = '';
enableHead1: Boolean;
enableHead2: Boolean;
enableclose: Boolean = false;
isEdit: Boolean = false;
currentcountry = '';
selectedcountry = {};
selectedregion = {};
selectedcentre = {};
selectedchurch = {};
selectedtitle = {};
dobvalue: String;
setenroldate: any;
expirydate: any;
getRecordReq: any;
moddate: any;
members: Array<Object> = [{
    'MMM_NAME_TEXT': 'Search',
    'MMM_NAME1': '',
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
imgChange: Boolean = false;
formdt: FormData = new FormData();
url = '../../assets/loginasset/images/display-img.jpg';
confirmDialogRef: MatDialogRef<DialogComponent>;
header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
public countryFilterCtrl: FormControl = new FormControl();
public regionFilterCtrl: FormControl = new FormControl();
public centreFilterCtrl: FormControl = new FormControl();
public churchFilterCtrl: FormControl = new FormControl();
public testFilterCtrl: FormControl = new FormControl();
public titleFilterCtrl: FormControl = new FormControl();
public memberFilterCtrl: FormControl = new FormControl();
public filteredtest: ReplaySubject<Array<any>> = new ReplaySubject<any[]>(1);
public filteredMember: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);


public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
public filteredText: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
public filteredCentre: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
public filteredChurch: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
constructor(
              private _formBuilder: FormBuilder,
              private apiService: ApiService,
              private memberService: MemberService,
              private editService: EditService,
              private _fuseSidebarService: FuseSidebarService,
              private router: Router,
              private act_route: ActivatedRoute,
              public _matDialog: MatDialog,
              private authService: AuthService,
              private httpClient: HttpClient,
              private GlobalUrls: GlobalUrl
            ) { }

  ngOnInit(): void {
    this.editService.currentMember.subscribe(message => {
        this.currentMem = message;

     const modificationdate = new Date().toDateString();
 
    
 
    this.act_route.params.subscribe(params => {
      
 
       
          this.registerid = params['id'];

         if (this.registerid == Type.Member) {
            this.enableHead1 = true;
            this.enableHead2 = false;
      
            this.stprPrimary = this._formBuilder.group({
                MemberId: [''],
                txtFirstName: ['', Validators.required],
                txtMiddleName: [''],
                txtLastName: [''],
                // txtMobile: ['', [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$')]],
                txtMobile: ['',[Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                txtMobile2: ['',[Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                ddlGender: [0],
                ddlTitle: [''],
                txtDob: [null],
                txtAadharNo: ['', [Validators.maxLength(12), Validators.minLength(12)]],
                txtEmail: ['', Validators.email],
             //  address: this._formBuilder.array([this._formBuilder.group({house: '', street: '', city: '', state: '', country: ''})]),
             txtHouse: [''],
             txtStreet: [''],
             txtCity: [''],
             txtState: [''],
             ddlCountry: [''],
             photo: ['']
              });
              this.stprSecondary = this._formBuilder.group({
                txtFatherName: [''],
                txtMotherName: [''],
               ddlMaritalStatus: [0],
                txtSpouseName: [''],
                txtNoChildren: [0],
                txtProfession: [''],
                 ddlBloodGroup: ['']
            });
            this.stprTeritary = this._formBuilder.group({
             //   test: [''],
             ddlCountry: [''],
                ddlRegion: [''],
                ddlCentre: [''],
                ddlChurch: [''],
                txtEnrollmentDate: [null],
                txtmembershipexpirydate: [null]
            });
         }else if (this.registerid == Type.Ministry) {
            this.enableHead1 = false;
            this.enableHead2 = true;
            this.stprPrimary = this._formBuilder.group({
                MemberId: [''],
                member: [''],
                ddlTitle: [''],
                txtFirstName: ['', Validators.required],
                txtMiddleName: [''],
                txtLastName: [''],
                txtMobile: ['',[Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                txtMobile2: ['',[Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                ddlGender: [0],
                txtDob: [null],
                txtAadharNo: ['', [Validators.maxLength(12), Validators.minLength(12)]],
                txtEmail: ['', Validators.email],
                // address: this._formBuilder.array([this._formBuilder.group({house: '', street: '', city: '', state: '', country: ''})]),
                txtHouse: [''],
                txtStreet: [''],
                txtCity: [''],
                txtState: [''],
                ddlCountry: [''],
                photo: ['']
              });
              this.stprSecondary = this._formBuilder.group({
                txtFatherName: [''],
                txtMotherName: [''],
               ddlMaritalStatus: [0],
                txtSpouseName: [''],
                txtNoChildren: [0],
                txtProfession: [''],
                 ddlBloodGroup: ['']
            });
            this.stprTeritary = this._formBuilder.group({
                ddlCountry: [''],
                ddlRegion: [''],
                ddlCentre: [''],
                ddlChurch: [''],
                txtEnrollmentDate: [null],
                txtmembershipexpirydate: [null]
            });
         }else if (this.registerid == Type.editMember) {
            this.enableHead1 = true;
            this.enableHead2 = false;
            this.isEdit = true;
            this.url = this.baseUrl + this.GlobalUrls.MemberImgFolder + this.currentMem['MMM_PHOTO'];
           this.imgname = this.currentMem['MMM_PHOTO'];
            this.stprPrimary = this._formBuilder.group({
                MemberId: [this.currentMem['MMM_ID'], Validators.required],
                txtFirstName: [this.currentMem['MMM_NAME1'], Validators.required],
              
                txtMiddleName: [this.currentMem['MMM_NAME2']],
                txtLastName: [this.currentMem['MMM_NAME3']],
               
                 txtMobile: [this.currentMem['MMM_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                 txtMobile2: [this.currentMem['MMM_MOBIL2'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                ddlGender: [this.currentMem['MMM_GENDER']],
                
                ddlTitle: [''],
                txtDob: [this.currentMem['MMM_DOB'].substring(0, 10)],
                txtAadharNo: [this.currentMem['MMM_AADHR_SSN_NO'], [Validators.maxLength(12), Validators.minLength(12)]],
                txtEmail: [this.currentMem['MMM_EMAIL'], Validators.email],
                // address: this._formBuilder.array([
                //     this._formBuilder.group({
                txtHouse: [this.currentMem['MMM_ADDR1']], 
                txtStreet: [this.currentMem['MMM_ADDR2']],
                txtCity: [this.currentMem['MMM_CITY']], 
                txtState: [this.currentMem['MMM_STATE']],
                ddlCountry: [this.currentMem['CNT_NAME']],
                       // country: this.currentMem['MMM_COUNTRY']})]),
                photo: [this.currentMem['MMM_PHOTO']]
              });
              this.stprSecondary = this._formBuilder.group({
                txtFatherName: [ this.currentMem['MMM_FATHER_NAME']],
                txtMotherName: [ this.currentMem['MMM_MOTHER_NAME']],
               ddlMaritalStatus: [ this.currentMem['MMM_MARITAL_STATUS']],
                txtSpouseName: [ this.currentMem['MMM_SPOUSE_NAME']],
                txtNoChildren: [ this.currentMem['MMM_NO_OF_CHILDREN']],
                txtProfession: [ this.currentMem['MMM_PROFESSION']],
                 ddlBloodGroup: [ this.currentMem['MMM_BLOOD_GROUP']]
            });
            this.stprTeritary = this._formBuilder.group({
                ddlCountry: [''],
                ddlRegion: [''],
                ddlCentre: [''],
                ddlChurch: [''],
                txtEnrollmentDate: [ this.currentMem['MMM_ENROLL_DATE'].substring(0, 10)],
                txtmembershipexpirydate: [ this.currentMem['MMM_EXPIRY_DATE'].substring(0, 10)]
            });
        }else if (this.registerid == Type.editMinistry) {
            this.enableHead1 = false;
            this.enableHead2 = true;
            this.url = this.baseUrl + this.GlobalUrls.MemberImgFolder + this.currentMem['MMM_PHOTO'];
            this.imgname = this.currentMem['MMM_PHOTO'];
            this.members = [{
                'MMM_NAME_TEXT': this.currentMem['MMM_NAME_TEXT'],
                'MMM_NAME1': this.currentMem['MMM_NAME1'],
                'MMM_NAME2': this.currentMem['MMM_NAME2'],
                'MMM_NAME3': this.currentMem['MMM_NAME3'],
                'MMM_PK': this.currentMem['MMM_MEMBER']
            
               }];
            this.stprPrimary = this._formBuilder.group({
                MemberId: [this.currentMem['MMM_ID'], Validators.required],
               
                ddlTitle: [''],
                txtFirstName: [this.currentMem['MMM_NAME1'], Validators.required],
                // member: [this.currentMem['MMM_NAME_TEXT']],
                member: [this.currentMem['MMM_MEMBER']],
                txtMiddleName: [this.currentMem['MMM_NAME2']],
                txtLastName: [this.currentMem['MMM_NAME3']],
                txtMobile: [this.currentMem['MMM_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                txtMobile2: [this.currentMem['MMM_MOBIL2'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                ddlGender: [this.currentMem['MMM_GENDER']],
             
                txtDob: [this.currentMem['MMM_DOB'].substring(0, 10)],
                txtAadharNo: [this.currentMem['MMM_AADHR_SSN_NO'], [Validators.maxLength(12), Validators.minLength(12)]],
                txtEmail: [this.currentMem['MMM_EMAIL'], Validators.email],
                // address: this._formBuilder.array([
                //     this._formBuilder.group({
                txtHouse: [this.currentMem['MMM_ADDR1']], 
                txtStreet: [this.currentMem['MMM_ADDR2']],
                txtCity: [this.currentMem['MMM_CITY']], 
                txtState: [this.currentMem['MMM_STATE']],
                ddlCountry: [this.currentMem['CNT_NAME']],
                       // country: this.currentMem['MMM_COUNTRY']})]),
               // photo: [this.currentMem['MMM_PHOTO']]
               photo: ['']
              });
              this.stprSecondary = this._formBuilder.group({
                txtFatherName: [ this.currentMem['MMM_FATHER_NAME']],
                txtMotherName: [ this.currentMem['MMM_MOTHER_NAME']],
               ddlMaritalStatus: [ this.currentMem['MMM_MARITAL_STATUS']],
                txtSpouseName: [ this.currentMem['MMM_SPOUSE_NAME']],
                txtNoChildren: [ this.currentMem['MMM_NO_OF_CHILDREN']],
                txtProfession: [ this.currentMem['MMM_PROFESSION']],
                 ddlBloodGroup: [ this.currentMem['MMM_BLOOD_GROUP']]
            });
            this.stprTeritary = this._formBuilder.group({
                ddlCountry: [''],
                ddlRegion: [''],
                ddlCentre: [''],
                ddlChurch: [''],
                txtEnrollmentDate: [ this.currentMem['MMM_ENROLL_DATE'].substring(0, 10)],
                txtmembershipexpirydate: [ this.currentMem['MMM_EXPIRY_DATE'].substring(0, 10)]
            });
        }else if (this.registerid == Type.viewMemberDetails) {
            this.enableclose = true;
            this.enableHead1 = true;
            this.enableHead2 = false;
            this.url = this.baseUrl + this.GlobalUrls.MemberImgFolder + this.currentMem['MMM_PHOTO'];
         //   this.imgname = this.currentMem['MMM_PHOTO'];
            this.stprPrimary = this._formBuilder.group({
                MemberId: [this.currentMem['MMM_ID']],
                txtFirstName: [this.currentMem['MMM_NAME1'], Validators.required],
           
                txtMiddleName: [this.currentMem['MMM_NAME2']],
                txtLastName: [this.currentMem['MMM_NAME3']],
                txtMobile: [this.currentMem['MMM_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                txtMobile2: [this.currentMem['MMM_MOBIL2'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                ddlGender: [this.currentMem['MMM_GENDER']],
               
                ddlTitle: [this.currentMem['MMM_TITLE']],
                txtDob: [this.currentMem['MMM_DOB'].substring(0, 10)],
                txtAadharNo: [this.currentMem['MMM_AADHR_SSN_NO'], [Validators.maxLength(12), Validators.minLength(12)]],
                txtEmail: [this.currentMem['MMM_EMAIL'], Validators.email],
                // address: this._formBuilder.array([
                //     this._formBuilder.group({
                txtHouse: [this.currentMem['MMM_ADDR1']], 
                txtStreet: [this.currentMem['MMM_ADDR2']],
                txtCity: [this.currentMem['MMM_CITY']], 
                txtState: [this.currentMem['MMM_STATE']],
                ddlCountry: [this.currentMem['CNT_NAME']],
                       // country: this.currentMem['MMM_COUNTRY']})]),
                photo: [this.currentMem['MMM_PHOTO']]
              });
              this.stprSecondary = this._formBuilder.group({
                txtFatherName: [ this.currentMem['MMM_FATHER_NAME']],
                txtMotherName: [ this.currentMem['MMM_MOTHER_NAME']],
               ddlMaritalStatus: [ this.currentMem['MMM_MARITAL_STATUS']],
                txtSpouseName: [ this.currentMem['MMM_SPOUSE_NAME']],
                txtNoChildren: [ this.currentMem['MMM_NO_OF_CHILDREN']],
                txtProfession: [ this.currentMem['MMM_PROFESSION']],
                 ddlBloodGroup: [ this.currentMem['MMM_BLOOD_GROUP']]
            });
            this.stprTeritary = this._formBuilder.group({
                ddlCountry: [''],
                ddlRegion: [''],
                ddlCentre: [''],
                ddlChurch: [''],
                txtEnrollmentDate: [ this.currentMem['MMM_ENROLL_DATE'].substring(0, 10)],
                txtmembershipexpirydate: [ this.currentMem['MMM_EXPIRY_DATE'].substring(0, 10)]
            });
            this.stprPrimary.disable();
            this.stprSecondary.disable();
            this.stprTeritary.disable();
        }else if (this.registerid == Type.viewMinistryDetails) {
            this.enableclose = true;
            this.enableHead1 = false;
            this.enableHead2 = true;
            this.url = this.baseUrl + this.GlobalUrls.MemberImgFolder + this.currentMem['MMM_PHOTO'];
         //   this.imgname = this.currentMem['MMM_PHOTO'];
            this.stprPrimary = this._formBuilder.group({
                MemberId: [this.currentMem['MMM_ID'], Validators.required],
                // member: [this.currentMem['MMM_NAME_TEXT'], Validators.required],
                member: [this.currentMem['MMM_MEMBER']],
                ddlTitle: [''],
                txtFirstName: [this.currentMem['MMM_NAME1'], Validators.required],
                
                txtMiddleName: [this.currentMem['MMM_NAME2']],
                txtLastName: [this.currentMem['MMM_NAME3']],
                txtMobile: [this.currentMem['MMM_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                txtMobile2: [this.currentMem['MMM_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                ddlGender: [this.currentMem['MMM_GENDER']],
                
                txtDob: [this.currentMem['MMM_DOB'].substring(0, 10)],
                txtAadharNo: [this.currentMem['MMM_AADHR_SSN_NO'], [Validators.maxLength(12), Validators.minLength(12)]],
                txtEmail: [this.currentMem['MMM_EMAIL'], Validators.email],
                // address: this._formBuilder.array([
                //     this._formBuilder.group({
                txtHouse: [this.currentMem['MMM_ADDR1']], 
                txtStreet: [this.currentMem['MMM_ADDR2']],
                txtCity: [this.currentMem['MMM_CITY']], 
                txtState: [this.currentMem['MMM_STATE']],
                ddlCountry: [this.currentMem['CNT_NAME']],
                       // country: this.currentMem['MMM_COUNTRY']})]),
                photo: ['']
              });
              this.stprSecondary = this._formBuilder.group({
                txtFatherName: [ this.currentMem['MMM_FATHER_NAME']],
                txtMotherName: [ this.currentMem['MMM_MOTHER_NAME']],
               ddlMaritalStatus: [ this.currentMem['MMM_MARITAL_STATUS']],
                txtSpouseName: [ this.currentMem['MMM_SPOUSE_NAME']],
                txtNoChildren: [ this.currentMem['MMM_NO_OF_CHILDREN']],
                txtProfession: [ this.currentMem['MMM_PROFESSION']],
                 ddlBloodGroup: [ this.currentMem['MMM_BLOOD_GROUP']]
            });
            this.stprTeritary = this._formBuilder.group({
                ddlCountry: [this.currentMem['CNT_NAME']],
                ddlRegion: [''],
                ddlCentre: [''],
                ddlChurch: [''],
                txtEnrollmentDate: [ this.currentMem['MMM_ENROLL_DATE'].substring(0, 10)],
                txtmembershipexpirydate: [ this.currentMem['MMM_EXPIRY_DATE'].substring(0, 10)]
            });
            this.stprPrimary.disable();
            this.stprSecondary.disable();
            this.stprTeritary.disable();
        }
    });
// });

   this.getCountries(this.currentMem['MMM_COUNTRY']);
   this.getTitleText();

   this.getRegion(this.currentMem['MMM_COUNTRY'], this.currentMem['CTR_REGION']);
   this.getCentre(this.currentMem['CTR_REGION'], this.currentMem['CCH_CENTRE']);
   this.getChurch(this.currentMem['CCH_CENTRE'], this.currentMem['MMM_CHURCH']);
   this.getMembers();
 
  
    this.testFilterCtrl.valueChanges.subscribe(() => {
        this.filters();
    });
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
      this.memberFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterMember();
      });

   
      
    });
  }
  
//   get getAddress(): FormArray {
//     return this.stprPrimary.get('address') as FormArray;
//  }

 onSelectionchange(event): void{
   this.imgChange = true;
    this.selectedfile = event.target.files[0];
    this.imgname = uuid() + '_' + this.selectedfile.name;
    this.formdt.append('image', this.selectedfile , this.imgname);
 
   if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]); // read file as data url

    reader.onload = (even) => { // called once readAsDataURL is completed
       this.url = even.target['result'];
      
     };
    }
  }
getCountries(countryText): any {
    this.apiService.getCountry(this.header).subscribe((data: Array<object>) => {
        this.countires = data['Data'];
        // console.log(this.countires );
        this.filteredCount.next(this.countires.slice());
    if (countryText != '') {
      
       this.stprTeritary.controls.ddlCountry.setValue(this.currentMem['MMM_COUNTRY']);
    }

   });
}



getTitleText(): void {
    this.titlerequest = {
        'CFG_TYPE': 'TITLE'
    };
    this.apiService.getConfigValues(this.titlerequest,this.header).subscribe((data: Array<object>) => {
        this.title = data['Data'];
        this.filteredText.next(this.title.slice());
        this.stprPrimary.controls.ddlTitle.setValue(this.currentMem['MMM_TITLE']);
   });
   
}

getRegion(countryPK: any, regionPK: any): void{
     if (countryPK != '') {
        this.regionrequest = {
            'RGN_COUNTRY': countryPK
        };
        this.apiService.getRegion(this.regionrequest, this.header).subscribe((data: Array<object>) => {
            this.regiondata = data['Data'];
            if (this.regiondata != null) {
            this.filteredRegion.next(this.regiondata.slice());
           }
          });
          this.stprTeritary.controls.ddlRegion.setValue(regionPK);
     }
}
getCentre(regionPK: any, centrePK: string): void{
    if (regionPK != '') {
        this.centrerequest = {
            'CTR_REGION': regionPK
        };
        this.apiService.getCentre(this.centrerequest, this.header).subscribe((data: Array<object>) => {
            this.centredata = data['Data'];
            if (this.centredata != null) {
              this.filteredCentre.next(this.centredata.slice());
            }
          });
          this.stprTeritary.controls.ddlCentre.setValue(centrePK);
     }
}
getChurch(centrePK: any, churchTXT: any): void {
    if (centrePK != '') {
        this.churchrequest = {
            'CCH_CENTRE': centrePK
        };
        this.apiService.getChurch(this.churchrequest, this.header).subscribe((data: Array<object>) => {
            this.churchdata = data['Data'];
            if (this.churchdata != null) {
              this.filteredChurch.next(this.churchdata.slice());
            }
          });
          this.stprTeritary.controls.ddlChurch.setValue(churchTXT);
     }
} 
getRecord(value): any {
    this.getRecordReq = {
                'REC_PK': value
            };
            this.header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
            this.memberService.getRecordDetails(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
                this.currMem = data['Data']; 
            });  
           
}
getMembers(): any {
    this.filteredMember.next(this.members.slice());
//     this.memberService.getMember().subscribe((data: Array<object>) => {
//         this.members = data['Data'];
        
//        this.filteredMember.next(this.members.slice());
//   });
  }

 
private filters(): String[] {
    let search = this.testFilterCtrl.value;
    if (!search) {
      this.filteredCount.next(this.country.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
 
    this.filteredtest.next(
      this.countires.filter(country => country['CNT_NAME'].toLowerCase().indexOf(search) > -1)
    );


  }

  

  onCountrySelect(): any {
    this.stprTeritary.controls.ddlRegion.reset();
    this.stprTeritary.controls.ddlCentre.reset();
    this.stprTeritary.controls.ddlChurch.reset();
    this.filteredRegion.next([]);
    this.filteredCentre.next([]);
    this.filteredChurch.next([]); 
    this.regionrequest = {
        'RGN_COUNTRY': this.stprTeritary.value.ddlCountry
    };
    this.apiService.getRegion(this.regionrequest, this.header).subscribe((data: Array<object>) => {
        this.regiondata = data['Data'];
        if (this.regiondata !== null){
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
    'CTR_REGION': this.stprTeritary.value.ddlRegion
   };
   this.apiService.getCentre(this.centrerequest,  this.header).subscribe((data: Array<object>) => {
    this.centredata = data['Data'];

      this.filteredCentre.next(this.centredata.slice());

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
onTitleSelect(): void {
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
onChurchSelect(): void {
    for (let i = 0; i < this.churchdata.length; i++) {
        if (this.churchdata[i]['CCH_NAME'] === this.stprTeritary.value.ddlChurch) {
            this.selectedchurch = this.churchdata[i];
        } 
      }
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

private filterTitles(): void {
    let search = this.titleFilterCtrl.value;
    if (!search) {
        this.filteredText.next(this.title.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the Regions
      this.filteredText.next(
        this.title.filter(config => config['CFG_DATA'].toLowerCase().indexOf(search) > -1)
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
private filterMember(): void{
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
         this.members.splice(0,0,this.searchDataNull);
         this.filteredMember.next(this.members);
     });
 
  
}




onMemberSelect(): void {
    this.getRecordReq = {
        'REC_PK':  this.stprPrimary.value.member
    };
    this.header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    this.memberService.getRecordDetails(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
     this.currMem = data['Data'][0];
     this.url = this.baseUrl + this.GlobalUrls.MemberImgFolder + this.currMem['MMM_PHOTO'];
     this.imgname = this.currMem['MMM_PHOTO'];
     this.stprPrimary.controls.ddlTitle.setValue(this.currMem['MMM_TITLE']);
     this.stprPrimary.controls.txtFirstName.setValue(this.currMem['MMM_NAME1']);
 
     this.stprPrimary.controls.txtMiddleName.setValue(this.currMem['MMM_NAME2']);
     this.stprPrimary.controls.txtLastName.setValue(this.currMem['MMM_NAME3']);
     this.stprPrimary.controls.txtMobile.setValue(this.currMem['MMM_MOBIL']);
     this.stprPrimary.controls.txtMobile2.setValue(this.currMem['MMM_MOBIL2']);
     this.stprPrimary.controls.ddlGender.setValue(this.currMem['MMM_GENDER']);
     this.stprPrimary.controls.txtDob.setValue(this.currMem['MMM_DOB'].substring(0, 10));
     this.stprPrimary.controls.txtAadharNo.setValue(this.currMem['MMM_AADHR_SSN_NO']);
     this.stprPrimary.controls.txtEmail.setValue(this.currMem['MMM_EMAIL']);
     this.stprPrimary.controls.txtHouse.setValue(this.currMem['MMM_ADDR1']);
     this.stprPrimary.controls.txtStreet.setValue(this.currMem['MMM_ADDR2']);
     this.stprPrimary.controls.txtCity.setValue(this.currMem['MMM_CITY']);
     this.stprPrimary.controls.txtState.setValue(this.currMem['MMM_STATE']);
     this.stprPrimary.controls.ddlCountry.setValue(this.currMem['CNT_NAME']);
     this.stprSecondary.controls.txtFatherName.setValue(this.currMem['MMM_FATHER_NAME']);
     this.stprSecondary.controls.txtMotherName.setValue(this.currMem['MMM_MOTHER_NAME']);
     this.stprSecondary.controls.ddlMaritalStatus.setValue(this.currMem['MMM_MARITAL_STATUS']);
     this.stprSecondary.controls.txtSpouseName.setValue(this.currMem['MMM_SPOUSE_NAME']);
     this.stprSecondary.controls.txtNoChildren.setValue(this.currMem['MMM_NO_OF_CHILDREN']);
     this.stprSecondary.controls.txtProfession.setValue(this.currMem['MMM_PROFESSION']);
     this.stprSecondary.controls.ddlBloodGroup.setValue(this.currMem['MMM_BLOOD_GROUP']);
     this.stprTeritary.controls.ddlCountry.setValue(this.currMem['MMM_COUNTRY']);
     this.stprTeritary.controls.txtEnrollmentDate.setValue(this.currMem['MMM_ENROLL_DATE'].substring(0, 10));
     this.stprTeritary.controls.txtmembershipexpirydate.setValue(this.currMem['MMM_EXPIRY_DATE'].substring(0, 10));
     this.getRegion(this.currMem['MMM_COUNTRY'], this.currMem['CTR_REGION']);
     this.getCentre(this.currMem['CTR_REGION'], this.currMem['CCH_CENTRE']);
     this.getChurch(this.currMem['CCH_CENTRE'], this.currMem['MMM_CHURCH']);
    
    
 }); 
}
register(): void {
    
  if ( this.registerid == Type.Member) {
    this.moddate =  new Date().toISOString();
    this.saveRequest = {
        'MMM_TITLE': this.stprPrimary.value.txtFirstName,
        // 'MMM_NAME_TEXT': this.stprPrimary.value.txtFirstName,
        // 'CFG_PK':1,
        'MMM_PK': 0,
        'MMM_ID': this.stprPrimary.value.MemberId,
        'MMM_TYPE': Type.Member,
        'MMM_AADHR_SSN_NO':  this.stprPrimary.value.txtAadharNo,
        'MMM_ADDR1': this.stprPrimary.value.txtHouse,
        'MMM_ADDR2': this.stprPrimary.value.txtStreet,
        'MMM_BLOOD_GROUP':  this.stprSecondary.value.ddlBloodGroup,
        'MMM_CENTER': this.stprTeritary.value.ddlCentre,
        'MMM_CHURCH': this.stprTeritary.value.ddlChurch,
        'MMM_CITY': this.stprPrimary.value.txtCity,
        'MMM_COUNTRY': this.stprTeritary.value.ddlCountry,
        'MMM_DOB': this.stprPrimary.value.txtDob,
        'MMM_EMAIL': this.stprPrimary.value.txtEmail,
        'MMM_ENROLL_DATE': this.stprTeritary.value.txtEnrollmentDate,
        'MMM_EXPIRY_DATE': this.stprTeritary.value.txtmembershipexpirydate,
        'MMM_FATHER_NAME': this.stprSecondary.value.txtFatherName,
        'MMM_GENDER': this.stprPrimary.value.ddlGender,
        
        'MMM_MARITAL_STATUS': this.stprSecondary.value.ddlMaritalStatus,
        'MMM_MOBIL': this.stprPrimary.value.txtMobile,
        'MMM_MOBIL2': this.stprPrimary.value.txtMobile2,
        'MMM_MOTHER_NAME': this.stprSecondary.value.txtMotherName,
        'MMM_NAME1': this.stprPrimary.value.txtFirstName,
     
        'MMM_NAME2': this.stprPrimary.value.txtMiddleName,
        'MMM_NAME3': this.stprPrimary.value.txtLastName,
        'MMM_NO_OF_CHILDREN': this.stprSecondary.value.ddlNoChildren,
         'MMM_PHOTO':  this.imgname,
        'MMM_PROFESSION': this.stprSecondary.value.txtProfession,
        'MMM_REGION': this.stprTeritary.value.ddlRegion,
        'MMM_SPOUSE_NAME': this.stprSecondary.value.txtSpouseName,
        'MMM_STATE': this.stprPrimary.value.txtState,
        'MMM_MEMBER': this.stprPrimary.value.member,
         'MMM_ACTIVE': 1,
         'USER_PK': 1,
        'LAST_MOD_DT': this.moddate 
    };
    console.log("Save Json-->>");
    console.log(this.saveRequest);
     if (this.imgChange){
        this.memberService.registerMemberImage(this.formdt, this.header)
     .subscribe(res => {
       if (res['Message'] == 1) {
          
        this.memberService.registerMember(this.saveRequest).subscribe((data: Array<object>) => {
       
            if (data['Data'] > 0) {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
        
                this.confirmDialogRef.componentInstance.Message = 'Member is registered succesfully';
              //  alert('Member is registered succesfully');
              
              this.confirmDialogRef.afterClosed().subscribe(result => {
                if ( result )
                {
                    this.router.navigate(['/memberlist']);
                }
                this.confirmDialogRef = null;
            });
            }else {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
                this.confirmDialogRef.componentInstance.isError = true;
                if (data['Data'] === -1){
                    this.confirmDialogRef.componentInstance.Message = 'Error Occured';
                }else if (data['Data'] === -2) {
                    this.confirmDialogRef.componentInstance.Message = 'Already Exixts';
                }else if (data['Data'] === -3) {
                    this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';
                }else if (data['Data'] === 0) {
                    this.confirmDialogRef.componentInstance.Message = 'Record Already Exixts';
                }
            }
         });
          // alert('Image Saved Successfully');
       }else {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.isError = true;
        this.confirmDialogRef.componentInstance.Message = res['Message'];
         //  alert(res['Message']);
       }
     });
     }else  {
       
        this.memberService.registerMember(this.saveRequest).subscribe((data: Array<object>) => {
            if (data['Data'] > 0) {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
        
                this.confirmDialogRef.componentInstance.Message = 'Member is registered succesfully';
              //  alert('Member is registered succesfully');
              
              this.confirmDialogRef.afterClosed().subscribe(result => {
                if ( result )
                {
                    this.router.navigate(['/memberlist']);
                }
                this.confirmDialogRef = null;
            });
            }else {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
                this.confirmDialogRef.componentInstance.isError = true;
                if (data['Data'] === -1){
                    this.confirmDialogRef.componentInstance.Message = 'Error Occured';
                }else if (data['Data'] === -2) {
                    this.confirmDialogRef.componentInstance.Message = 'Already Exixts';
                }else if (data['Data'] === -3) {
                    this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';
                }else if (data['Data'] === 0) {
                    this.confirmDialogRef.componentInstance.Message = 'Record Already Exixts';
                }
            }
         });
     }
   
  }else if (this.registerid == Type.Ministry) {
      
      this.moddate = new Date().toISOString();
      this.saveRequest = {
        'MMM_TITLE': this.stprPrimary.value.ddlTitle,
        // 'MMM_NAME_TEXT': this.stprPrimary.value.txtFirstName,
        // 'CFG_PK':1,
         'MMM_PK': 0,
        'MMM_ID': this.stprPrimary.value.MemberId,
        'MMM_TYPE': Type.Member,
      
        'MMM_AADHR_SSN_NO':  this.stprPrimary.value.txtAadharNo,
        'MMM_ADDR1': this.stprPrimary.value.txtHouse,
        'MMM_ADDR2': this.stprPrimary.value.txtStreet,
        'MMM_BLOOD_GROUP':  this.stprSecondary.value.ddlBloodGroup,
        'MMM_CENTER': this.stprTeritary.value.ddlCentre,
        'MMM_CHURCH': this.stprTeritary.value.ddlChurch,
        'MMM_CITY': this.stprPrimary.value.txtCity,
        'MMM_COUNTRY': this.stprTeritary.value.ddlCountry,
       // "MMM_COUNTRY1": "1",
        'MMM_DOB': this.stprPrimary.value.txtDob,
        'MMM_EMAIL': this.stprPrimary.value.txtEmail,
        'MMM_ENROLL_DATE':  this.stprTeritary.value.txtEnrollmentDate,
        'MMM_EXPIRY_DATE':  this.stprTeritary.value.txtmembershipexpirydate,
        'MMM_FATHER_NAME': this.stprSecondary.value.txtFatherName,
        'MMM_GENDER': this.stprPrimary.value.ddlGender,
        'MMM_MARITAL_STATUS': this.stprSecondary.value.ddlMaritalStatus,
        'MMM_MOBIL': this.stprPrimary.value.txtMobile,
        'MMM_MOBIL2': this.stprPrimary.value.txtMobile2,
        'MMM_MOTHER_NAME': this.stprSecondary.value.txtMotherName,
        'MMM_NAME1': this.stprPrimary.value.txtFirstName,
       
        'MMM_NAME2': this.stprPrimary.value.txtMiddleName,
        'MMM_NAME3': this.stprPrimary.value.txtLastName,
        'MMM_NO_OF_CHILDREN': this.stprSecondary.value.txtNoChildren,
         'MMM_PHOTO':  this.imgname,
        'MMM_PROFESSION': this.stprSecondary.value.txtProfession,
        'MMM_REGION': this.stprTeritary.value.ddlRegion,
        'MMM_SPOUSE_NAME': this.stprSecondary.value.txtSpouseName,
        'MMM_STATE': this.stprPrimary.value.ddlState,
        'MMM_MEMBER': this.stprPrimary.value.member,
         'MMM_ACTIVE': 1,
         'USER_PK': 1,
        'LAST_MOD_DT':  this.moddate
    };
    console.log('m');
    console.log(this.saveRequest);
    
    if (this.imgChange){
        this.memberService.registerMemberImage(this.formdt, this.header)
     .subscribe(res => {
       if (res['Message'] == 1) {
        this.memberService.registerMinistry(this.saveRequest,  this.header).subscribe((data: Array<object>) => {
            if (data['Data'] > 0) {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
        
                this.confirmDialogRef.componentInstance.Message = 'Ministry is registered succesfully';
              //  alert('Member is registered succesfully');
              
              this.confirmDialogRef.afterClosed().subscribe(result => {
                if ( result )
                {
                    this.router.navigate(['/ministrylist']);
                }
                this.confirmDialogRef = null;
            });
            }else {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
                this.confirmDialogRef.componentInstance.isError = true;
                if (data['Data'] === -1){
                    this.confirmDialogRef.componentInstance.Message = 'Error Occured';
                }else if (data['Data'] === -2) {
                    this.confirmDialogRef.componentInstance.Message = 'Already Exixts';
                }else if (data['Data'] === -3) {
                    this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';
                }else if (data['Data'] === 0) {
                    this.confirmDialogRef.componentInstance.Message = 'Record Already Exixts';
                }
            }
          });
       }else {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.isError = true;
        this.confirmDialogRef.componentInstance.Message = res['Message'];
       }
     });
     }else  {
        this.memberService.registerMinistry(this.saveRequest,  this.header).subscribe((data: Array<object>) => {
       
            if (data['Data'] > 0) {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
        
                this.confirmDialogRef.componentInstance.Message = 'Ministry is registered succesfully';
              //  alert('Member is registered succesfully');
              
              this.confirmDialogRef.afterClosed().subscribe(result => {
                if ( result )
                {
                    this.router.navigate(['/ministrylist']);
                }
                this.confirmDialogRef = null;
            });
            }else {
                this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                    disableClose: true
                });
                this.confirmDialogRef.componentInstance.isError = true;
                if (data['Data'] === -1){
                    this.confirmDialogRef.componentInstance.Message = 'Error Occured';
                }else if (data['Data'] === -2) {
                    this.confirmDialogRef.componentInstance.Message = 'Already Exixts';
                }else if (data['Data'] === -3) {
                    this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';
                }else if (data['Data'] === 0) {
                    this.confirmDialogRef.componentInstance.Message = 'Record Already Exixts';
                }
            }
         });
     }

}else if (this.registerid == Type.editMember) {
    this.saveRequest = {
        'MMM_TITLE': this.stprPrimary.value.ddlTitle,
        // 'MMM_NAME_TEXT': this.stprPrimary.value.txtFirstName,
        // 'CFG_PK':1,
        'MMM_ID': this.stprPrimary.value.MemberId,
        'MMM_TYPE': Type.Member,
        'MMM_AADHR_SSN_NO':  this.stprPrimary.value.txtAadharNo,
        'MMM_ADDR1': this.stprPrimary.value.txtHouse,
        'MMM_ADDR2': this.stprPrimary.value.txtStreet,
        'MMM_BLOOD_GROUP':  this.stprSecondary.value.bloodgroup,
        'MMM_CENTER': this.stprTeritary.value.ddlCentre,
        'MMM_CHURCH': this.stprTeritary.value.ddlChurch,
        'MMM_CITY': this.stprPrimary.value.txtCity,
        'MMM_COUNTRY': this.stprTeritary.value.ddlCountry,
       // "MMM_COUNTRY1": "1",
        'MMM_DOB': this.stprPrimary.value.txtDob,
        'MMM_EMAIL': this.stprPrimary.value.txtEmail,
        'MMM_ENROLL_DATE': this.stprTeritary.value.txtEnrollmentDate,
        'MMM_EXPIRY_DATE': this.stprTeritary.value.txtmembershipexpirydate,
        'MMM_FATHER_NAME': this.stprSecondary.value.txtFatherName,
        'MMM_GENDER': this.stprPrimary.value.ddlGender,
       
        'MMM_MARITAL_STATUS': this.stprSecondary.value.maritalstatus,
        'MMM_MOBIL': this.stprPrimary.value.txtMobile,
        'MMM_MOBIL2': this.stprPrimary.value.txtMobile2,
        'MMM_MOTHER_NAME': this.stprSecondary.value.mothername,
        'MMM_NAME1': this.stprPrimary.value.txtFirstName,
      
        'MMM_NAME2': this.stprPrimary.value.txtMiddleName,
        'MMM_NAME3': this.stprPrimary.value.txtLastName,
        'MMM_NO_OF_CHILDREN': this.stprSecondary.value.nochildren,
        'MMM_PHOTO':  this.imgname,
        'MMM_PROFESSION': this.stprSecondary.value.profession,
        'MMM_REGION': this.stprTeritary.value.ddlRegion,
        'MMM_SPOUSE_NAME': this.stprSecondary.value.spousename,
        'MMM_STATE': this.stprPrimary.value.txtState,
        'MMM_MEMBER':  this.stprPrimary.value.member,
        'MMM_ACTIVE': 1,
        'MMM_PK': this.currentMem['MMM_PK'],
        'USER_PK': 1,
        'LAST_MOD_DT': this.currentMem['LAST_MOD_DT']
    };
 
    
    if (this.imgChange) {
        this.memberService.registerMemberImage(this.formdt, this.header)
        .subscribe(res => {
          if (res['Message'] == 1) {
            this.memberService.registerMember(this.saveRequest).subscribe((data: Array<object>) => {
                if (data['Data'] > 0) {
                    this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
            
                    this.confirmDialogRef.componentInstance.Message = 'Member Details are Edited Successfully';
            
                    this.confirmDialogRef.afterClosed().subscribe(result => {
                        if ( result )
                        {
                            this.editService.changeMember(this.editService.member);
                            this.router.navigate(['/memberlist']);
                        }
                        this.confirmDialogRef = null;
                    });
                  //  alert('Member details are edited');
                    // this.editService.changeMember(this.editService.member);
                    // this.router.navigate(['/memberlist']);
                }else {
                    this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
                    this.confirmDialogRef.componentInstance.isError = true;
                    if (data['Data'] === -1){
                        this.confirmDialogRef.componentInstance.Message = 'Error in Member Edition Please Try again';
                    }else if (data['Data'] === -2) {
                        this.confirmDialogRef.componentInstance.Message = 'Already Exixts';
                    }else if (data['Data'] === -3) {
                        this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';
                    }else if (data['Data'] === 0) {
                        this.confirmDialogRef.componentInstance.Message = 'Record Already Exixts';
                    }
                }
             });
          }else {
            this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                disableClose: true
            });
            this.confirmDialogRef.componentInstance.isError = true;
            this.confirmDialogRef.componentInstance.Message =  res['Message'];
          }
        });
    }else {
            this.memberService.registerMember(this.saveRequest).subscribe((data: Array<object>) => {
                if (data['Data'] > 0) {
                    this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
            
                    this.confirmDialogRef.componentInstance.Message = 'Member Details are Edited Successfully';
            
                    this.confirmDialogRef.afterClosed().subscribe(result => {
                        if ( result )
                        {
                           this.editService.changeMember(this.editService.member);
                           this.router.navigate(['/memberlist']);
                        }
                        this.confirmDialogRef = null;
                    });
                }else {
                    this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
                    this.confirmDialogRef.componentInstance.isError = true;
                    if (data['Data'] === -1){
                        this.confirmDialogRef.componentInstance.Message = 'Error in Member Edition Please Try again';
                    }else if (data['Data'] === -2) {
                        this.confirmDialogRef.componentInstance.Message = 'Already Exixts';
                    }else if (data['Data'] === -3) {
                        this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';
                    } 
                }
             });
    }
     
   }else if (this.registerid == Type.editMinistry) {
    this.saveRequest = {
     
        // 'CFG_PK':1,
        'MMM_ID': this.stprPrimary.value.MemberId,
        // 'MMM_NAME_TEXT': this.stprPrimary.value.member,
        //> 0 ? this.stprPrimary.value.member : null, 
        'MMM_TYPE': Type.Member,
        'MMM_TITLE': this.stprPrimary.value.ddlTitle,
        'MMM_AADHR_SSN_NO':  this.stprPrimary.value.txtAadharNo,
        'MMM_ADDR1': this.stprPrimary.value.txtHouse,
        'MMM_ADDR2': this.stprPrimary.value.txtStreet,
        'MMM_BLOOD_GROUP':  this.stprSecondary.value.ddlBloodGroup,
        'MMM_CENTER': this.stprTeritary.value.ddlCentre,
        'MMM_CHURCH': this.stprTeritary.value.ddlChurch,
        'MMM_CITY': this.stprPrimary.value.txtCity,
        'MMM_COUNTRY': this.stprTeritary.value.ddlCountry,
       // "MMM_COUNTRY1": "1",
        'MMM_DOB': this.stprPrimary.value.txtDob,
        'MMM_EMAIL': this.stprPrimary.value.txtEmail,
        'MMM_ENROLL_DATE': this.stprTeritary.value.txtEnrollmentDate,
        'MMM_EXPIRY_DATE': this.stprTeritary.value.txtmembershipexpirydate,
        'MMM_FATHER_NAME': this.stprSecondary.value.txtFatherName,
        'MMM_GENDER': this.stprPrimary.value.ddlGender,
        'MMM_MARITAL_STATUS': this.stprSecondary.value.ddlMaritalStatus,
        'MMM_MOBIL': this.stprPrimary.value.txtMobile,
        'MMM_MOBIL2': this.stprPrimary.value.txtMobile2,
        'MMM_MOTHER_NAME': this.stprSecondary.value.txtMotherName,
        'MMM_NAME1': this.stprPrimary.value.txtFirstName,
       
        'MMM_NAME2': this.stprPrimary.value.txtMiddleName,
        'MMM_NAME3': this.stprPrimary.value.txtLastName,
        'MMM_NO_OF_CHILDREN': this.stprSecondary.value.txtNoChildren,
        'MMM_PHOTO': this.imgname,
        'MMM_PROFESSION': this.stprSecondary.value.txtProfession,
        'MMM_REGION': this.stprTeritary.value.ddlRegion,
        'MMM_SPOUSE_NAME': this.stprSecondary.value.txtSpouseName,
        'MMM_STATE': this.stprPrimary.value.txtState,
        'MMM_MEMBER': this.stprPrimary.value.member,
        'MMM_ACTIVE': 1,
        'MMM_PK': this.currentMem['MMM_PK'],
        'USER_PK': 1,
        'LAST_MOD_DT': this.currentMem['LAST_MOD_DT']
    };
    console.log(this.stprPrimary.value.member);
     if (this.imgChange) {
        this.memberService.registerMemberImage(this.formdt, this.header)
        .subscribe(res => {
          if (res['Message'] == 1) {
            this.memberService.registerMinistry(this.saveRequest,  this.header).subscribe((data: Array<object>) => {
                if (data['Data'] > 0) {
                    this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
            
                    this.confirmDialogRef.componentInstance.Message = 'Ministry Details are Edited Successfully';
            
                    this.confirmDialogRef.afterClosed().subscribe(result => {
                        if ( result )
                        {
                            this.editService.changeMember(this.editService.member);
                            this.router.navigate(['/ministrylist']);
                        }
                        this.confirmDialogRef = null;
                    });
                    // alert('Ministry details are edited');
                    // this.editService.changeMember(this.editService.member);
                    // this.router.navigate(['/ministrylist']);
                }else {
                    this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
                    this.confirmDialogRef.componentInstance.isError = true;
                    if (data['Data'] === -1){
                        this.confirmDialogRef.componentInstance.Message = 'Error in Ministry Edition Please Try again';
                    }else if (data['Data'] === -2) {
                        this.confirmDialogRef.componentInstance.Message = 'Already Exixts';     
                    }else if (data['Data'] === -3) {
                        this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';  
                    }else if (data['Data'] === 0) {
                        this.confirmDialogRef.componentInstance.Message = 'Record Already Exixts';
                    }
                    // if (data['Data'] === -1){
                    //     alert('Error in Ministry Edition Please Try again');
                    // }else if (data['Data'] === -2) {
                    //     alert('Already Exixts');
                    // }else if (data['Data'] === -3) {
                    //     alert('Another user modified this record');
                    // }
                }
             });
          }else {
            this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                disableClose: true
            });
            this.confirmDialogRef.componentInstance.isError = true;
            this.confirmDialogRef.componentInstance.Message =  res['Message'];
          }
        });
    }else {
            this.memberService.registerMinistry(this.saveRequest,  this.header).subscribe((data: Array<object>) => {
                if (data['Data'] > 0) {
                    this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
            
                    this.confirmDialogRef.componentInstance.Message = 'Ministry Details are Edited Successfully';
            
                    this.confirmDialogRef.afterClosed().subscribe(result => {
                        if ( result )
                        {
                            this.editService.changeMember(this.editService.member);
                            this.router.navigate(['/ministrylist']);
                        }
                        this.confirmDialogRef = null;
                    });
                }else {
                    this.confirmDialogRef = this._matDialog.open(DialogComponent, {
                        disableClose: true
                    });
                    this.confirmDialogRef.componentInstance.isError = true;
                    if (data['Data'] === -1){
                        this.confirmDialogRef.componentInstance.Message = 'Error in Ministry Edition Please Try again';
                    }else if (data['Data'] === -2) {
                        this.confirmDialogRef.componentInstance.Message = 'Already Exixts';     
                    }else if (data['Data'] === -3) {
                        this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';  
                    }else if (data['Data'] === 0) {
                        this.confirmDialogRef.componentInstance.Message = 'Record Already Exixts';
                    }
                }  
             });
    }
     }
}
goBack(): void {
    if (this.registerid == Type.viewMemberDetails) {
        this.router.navigate(['/memberlist']);
    }else if (this.registerid == Type.viewMinistryDetails) {
        this.router.navigate(['/ministrylist']);
    }else if(this.registerid == Type.Member) {
        this.router.navigate(['/memberlist']);
    }else if(this.registerid == Type.editMember) {
        this.router.navigate(['/memberlist']);
    }else if(this.registerid == Type.Ministry) {
        this.router.navigate(['/ministrylist']);
    }else if(this.registerid == Type.editMinistry) {
        this.router.navigate(['/ministrylist']);
    }
    
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
onChange(event): void {
  if (event.value == null) {
      this.isdate = true;
  }
}
changeCntrl(): void {
    this.isEdit = false;
}
test(): void {
   
}
toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}
ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this.stprPrimary = this._formBuilder.group({
            txtFirstName: ['', Validators.required],
          
            txtMobile: ['',[Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
            txtMobile2: ['',[Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
            ddlGender: [0],
            ddlTitle: [''],
            txtDob: [''],
            txtAadharNo: ['', [Validators.maxLength(12), Validators.minLength(12)]],
            txtEmail: ['', Validators.email],
            address: this._formBuilder.array([this._formBuilder.group({txtHouse: '', txtStreet: '', txtCity: '', txtState: '', country: ''})]),
            photo: ['']
          });
    }
}
