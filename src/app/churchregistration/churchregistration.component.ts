import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { MatStepper } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { EditService } from '../services/member/edit.service';
import {AuthService} from '../authentication/auth.service';
import { MemberService } from '../services/member/member.service';
import {CommonEditService} from '../services/common/edit.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import { ApiService } from '../services/common/common.service';
import {Type} from '../utility/type';
import {ChurchReqModel} from '../business-object/churchbo';
@Component({
  selector: 'app-churchregistration',
  templateUrl: './churchregistration.component.html',
  styleUrls: ['./churchregistration.component.scss', '../scss/form.scss', '../scss/settingbutton.scss']
})
export class ChurchregistrationComponent implements OnInit {
    strpPrimary: FormGroup;
    stprSecondary: FormGroup;
    stprTeritary: FormGroup;
    members: any;
    presidentData = [{
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
     vicepresident1Data = [{
      'MMM_NAME_TEXT': 'Search',
        'MMM_NAME1': 'Search',
        'MMM_NAME2': 'Member',
        'MMM_NAME3': '',
        'MMM_PK': 0
 
     }];
     vicepresident2Data = [{
      'MMM_NAME_TEXT': 'Search',
        'MMM_NAME1': 'Search',
        'MMM_NAME2': 'Member',
        'MMM_NAME3': '',
        'MMM_PK': 0
 
     }];
     jointSec1Data = [{
      'MMM_NAME_TEXT': 'Search',
        'MMM_NAME1': 'Search',
        'MMM_NAME2': 'Member',
        'MMM_NAME3': '',
        'MMM_PK': 0
 
     }];
     joinSec2Data = [{
      'MMM_NAME_TEXT': 'Search',
        'MMM_NAME1': 'Search',
        'MMM_NAME2': 'Member',
        'MMM_NAME3': '',
        'MMM_PK': 0
 
     }];
     secretaryData = [{
      'MMM_NAME_TEXT': 'Search',
        'MMM_NAME1': 'Search',
        'MMM_NAME2': 'Member',
        'MMM_NAME3': '',
        'MMM_PK': 0
 
     }];
     treasureData = [{
      'MMM_NAME_TEXT': 'Search',
        'MMM_NAME1': 'Search',
        'MMM_NAME2': 'Member',
        'MMM_NAME3': '',
        'MMM_PK': 0
 
     }];
    memberlist = [];
    presidentid: any;
    vicpres1id: any;
    vicpres2id: any;
    secretaryId: any;
    jointSectr1Id: any;
    jointSectr2Id: any;
    treasurerId: any;
    countires: Array<object>;
    country: any = [];
    regionrequest = {};
    regiondata: any;
    regions: any = [];
    centrerequest: any = {};
    centredata: any;
    centers: any = [];
    saveRequest: ChurchReqModel;
    selectedcountry: any;
    selectedregion: any;
    currentChurch: any;
    registerid: number;
    moddate: any;
    isView: Boolean = false;
    confirmDialogRef: MatDialogRef<DialogComponent>;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    @ViewChild('stepper') stepper: MatStepper;
    public countryFilterCtrl: FormControl = new FormControl();
    public regionFilterCtrl: FormControl = new FormControl();
    public centreFilterCtrl: FormControl = new FormControl();
    public presidentFilterCtrl: FormControl = new FormControl();
    public vicpres1FilterCtrl: FormControl = new FormControl();
    public vicpres2Ctrl: FormControl = new FormControl();
    public secretaryCtrl: FormControl = new FormControl();
    public joinsecr1Ctrl: FormControl = new FormControl();
    public joinsecr2Ctrl: FormControl = new FormControl();
    public treasurerCtrl: FormControl = new FormControl();
    
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredCentre: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredMembers: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredpresident: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredVicepres1: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredVicepres2: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredSecretary: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredJointsec1: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredJointsec2: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredTreasurer: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    constructor( private _formBuilder: FormBuilder,
               private apiService: ApiService,
               private memberService: MemberService,
               private editService: EditService,
               private authService: AuthService,
               private commoneditService: CommonEditService,
               private _fuseSidebarService: FuseSidebarService,
               private router: Router,
               public _matDialog: MatDialog,
               private act_route: ActivatedRoute) { }

  ngOnInit(): void {
    this.commoneditService.currentChurch.subscribe(message => {
        this.currentChurch = message;
       console.log(this.currentChurch);
       const modificationdate = new Date().toDateString();
 
    // console.log( this.currentMem);
 
    this.act_route.params.subscribe(params => {
        this.registerid = params['id'];
        console.log(this.registerid);
        if (this.registerid == Type.editchurch) {
            if (this.currentChurch['CCH_PRESIDENT_TEXT'] !== null){
                this.presidentData = [{
                  'MMM_NAME_TEXT': this.currentChurch['CCH_PRESIDENT_TEXT'],
                    'MMM_NAME1': this.currentChurch['CCH_PRESIDENT_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentChurch['CCH_PRESIDENT']
                }];
            }
           
            if (this.currentChurch['CCH_VICE_PRESIDENT1_TEXT'] !== null){
                this.vicepresident1Data = [{
                  'MMM_NAME_TEXT': this.currentChurch['CCH_VICE_PRESIDENT1_TEXT'],
                    'MMM_NAME1': this.currentChurch['CCH_VICE_PRESIDENT1_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentChurch['CCH_VICE_PRESIDENT1']
                }];
            }
            
            if (this.currentChurch['CCH_VICE_PRESIDENT2_TEXT'] !== null){
                this.vicepresident2Data = [{
                  'MMM_NAME_TEXT': this.currentChurch['CCH_VICE_PRESIDENT2_TEXT'],
                    'MMM_NAME1': this.currentChurch['CCH_VICE_PRESIDENT2_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentChurch['CCH_VICE_PRESIDENT2']
                }];
            }
            
            if (this.currentChurch['CCH_JOINT_SECRETARY1_TEXT'] !== null){
                this.jointSec1Data = [{
                  'MMM_NAME_TEXT': this.currentChurch['CCH_JOINT_SECRETARY1_TEXT'],
                    'MMM_NAME1': this.currentChurch['CCH_JOINT_SECRETARY1_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentChurch['CCH_JOINT_SECRETARY1']
                }];
            }
           
            if (this.currentChurch['CCH_JOINT_SECRETARY2_TEXT'] !== null){
                this.joinSec2Data = [{
                  'MMM_NAME_TEXT': this.currentChurch['CCH_JOINT_SECRETARY2_TEXT'],
                    'MMM_NAME1': this.currentChurch['CCH_JOINT_SECRETARY2_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentChurch['CCH_JOINT_SECRETARY2']
                }];
            }
            
            if (this.currentChurch['CCH_SECRETARY_TEXT'] !== null){
                this.secretaryData = [{
                  'MMM_NAME_TEXT': this.currentChurch['CCH_SECRETARY_TEXT'],
                    'MMM_NAME1': this.currentChurch['CCH_SECRETARY_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentChurch['CCH_SECRETARY']
                }];
            }
          
            if (this.currentChurch['CCH_TREASURER_TEXT'] !== null){
                this.treasureData = [{
                  'MMM_NAME_TEXT': this.currentChurch['CCH_TREASURER_TEXT'],
                    'MMM_NAME1': this.currentChurch['CCH_TREASURER_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentChurch['CCH_TREASURER']
                }];
            }
          
            this.strpPrimary = this._formBuilder.group({
                churchID: [ this.currentChurch['CCH_ID'], [Validators.required]],
                txtName: [ this.currentChurch['CCH_NAME'], [Validators.required]],
                txtDateReg: [this.currentChurch['CCH_COUNCIL_BEGIN_DATE'].substring(0, 10)],
                txtMobile: [this.currentChurch['CCH_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15), Validators.required]],
                txtEmail: [this.currentChurch['CCH_EMAIL'], Validators.email],
                // address: this._formBuilder.array([this._formBuilder.group({ street: '', city: '', state: '', country: ''})]),
                txtStreet: [this.currentChurch['CCH_ADDR1']],
                txtCity: [this.currentChurch['CCH_CITY']],
                txtState: [this.currentChurch['CCH_STATE']],
                ddlCountry: [this.currentChurch['CCH_COUNTRY'], Validators.required],
                ddlRegion: ['',  Validators.required],
                ddlCentre: ['',  Validators.required]  
            });
        
            this.stprSecondary = this._formBuilder.group({
             
            });
            
            this.stprTeritary = this._formBuilder.group({
                president: [this.currentChurch['CCH_PRESIDENT']],
                vicpres1: [this.currentChurch['CCH_VICE_PRESIDENT1']],
                vicpres2: [this.currentChurch['CCH_VICE_PRESIDENT2']],
                secretary: [this.currentChurch['CCH_SECRETARY']],
                jointsecr1: [this.currentChurch['CCH_JOINT_SECRETARY1']],
                jointsecr2: [this.currentChurch['CCH_JOINT_SECRETARY2']],
                treasurer: [this.currentChurch['CCH_TREASURER']],
                councilelecteddate: [this.currentChurch['CCH_COUNCIL_ELECTED_DATE'].substring(0, 10)],
                councilbegindate: [this.currentChurch['CCH_COUNCIL_BEGIN_DATE'].substring(0, 10)],
                councilexpirydate: [this.currentChurch['CCH_COUNCIL_EXPIRY_DATE'].substring(0, 10)]
            });
        }else if (this.registerid == Type.viewChurch) {
            this.isView = true;
            this.presidentData = [{
              'MMM_NAME_TEXT': this.currentChurch['CCH_PRESIDENT_TEXT'],
                 'MMM_NAME1': this.currentChurch['CCH_PRESIDENT_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentChurch['CCH_PRESIDENT']
            }];
            this.vicepresident1Data = [{
              'MMM_NAME_TEXT': this.currentChurch['CCH_VICE_PRESIDENT1_TEXT'],
                'MMM_NAME1': this.currentChurch['CCH_VICE_PRESIDENT1_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentChurch['CCH_VICE_PRESIDENT1']
            }];
            this.vicepresident2Data = [{
              'MMM_NAME_TEXT': this.currentChurch['CCH_VICE_PRESIDENT2_TEXT'],
                'MMM_NAME1': this.currentChurch['CCH_VICE_PRESIDENT2_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentChurch['CCH_VICE_PRESIDENT2']
            }];
            this.jointSec1Data = [{
              'MMM_NAME_TEXT': this.currentChurch['CCH_JOINT_SECRETARY1_TEXT'],
                'MMM_NAME1': this.currentChurch['CCH_JOINT_SECRETARY1_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentChurch['CCH_JOINT_SECRETARY1']
            }];
            this.joinSec2Data = [{
              'MMM_NAME_TEXT': this.currentChurch['CCH_JOINT_SECRETARY2_TEXT'],
                'MMM_NAME1': this.currentChurch['CCH_JOINT_SECRETARY2_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentChurch['CCH_JOINT_SECRETARY2']
            }];
            this.secretaryData = [{
              'MMM_NAME_TEXT': this.currentChurch['CCH_SECRETARY_TEXT'],
                'MMM_NAME1': this.currentChurch['CCH_SECRETARY_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentChurch['CCH_SECRETARY']
            }];
            this.treasureData = [{
              'MMM_NAME_TEXT': this.currentChurch['CCH_TREASURER_TEXT'],
                'MMM_NAME1': this.currentChurch['CCH_TREASURER_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentChurch['CCH_TREASURER']
            }];
            this.strpPrimary = this._formBuilder.group({
                churchID: [ this.currentChurch['CCH_ID'], [Validators.required]],
                txtName: [ this.currentChurch['CCH_NAME'], [Validators.required]],
                txtDateReg: [this.currentChurch['CCH_COUNCIL_BEGIN_DATE'].substring(0, 10)],
                txtMobile: [this.currentChurch['CCH_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15), Validators.required]],
               
                txtEmail: [this.currentChurch['CCH_EMAIL'], Validators.email],
                // address: this._formBuilder.array([this._formBuilder.group({ street: '', city: '', state: '', country: ''})]),
                txtStreet: [this.currentChurch['CCH_ADDR1']],
                txtCity: [this.currentChurch['CCH_CITY']],
                txtState: [this.currentChurch['CCH_STATE']],
                ddlCountry: [this.currentChurch['CCH_COUNTRY'], Validators.required],
                ddlRegion: ['',  Validators.required],
                ddlCentre: ['',  Validators.required]  
            });
        
            this.stprSecondary = this._formBuilder.group({
             
            });
            
            this.stprTeritary = this._formBuilder.group({
                president: [this.currentChurch['CCH_PRESIDENT']],
                vicpres1: [this.currentChurch['CCH_VICE_PRESIDENT1']],
                vicpres2: [this.currentChurch['CCH_VICE_PRESIDENT2']],
                secretary: [this.currentChurch['CCH_SECRETARY']],
                jointsecr1: [this.currentChurch['CCH_JOINT_SECRETARY1']],
                jointsecr2: [this.currentChurch['CCH_JOINT_SECRETARY2']],
                treasurer: [this.currentChurch['CCH_TREASURER']],
                councilelecteddate: [this.currentChurch['CCH_COUNCIL_ELECTED_DATE'].substring(0, 10)],
                councilbegindate: [this.currentChurch['CCH_COUNCIL_BEGIN_DATE'].substring(0, 10)],
                councilexpirydate: [this.currentChurch['CCH_COUNCIL_EXPIRY_DATE'].substring(0, 10)]
            });
            this.stepper.selectedIndex = 3;
            this.strpPrimary.disable();
            this.stprSecondary.disable();
            this.stprTeritary.disable();
        }else {
        this.strpPrimary = this._formBuilder.group({
        churchID:['', Validators.required],
        txtName: ['', Validators.required],
        txtDateReg: [''],
        txtMobile: [this.currentChurch['CCH_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15), Validators.required]],
        txtEmail: ['', Validators.email],
        // address: this._formBuilder.array([this._formBuilder.group({ street: '', city: '', state: '', country: ''})]),
        txtStreet: [''],
        txtCity: [''],
        txtState: [''],
        ddlCountry: ['', Validators.required],
        ddlRegion: ['',  Validators.required],
        ddlCentre: ['',  Validators.required]  
    });

    this.stprSecondary = this._formBuilder.group({
     
    });
    
    this.stprTeritary = this._formBuilder.group({
        president: [null],
        vicpres1: [null],
        vicpres2: [null],
        secretary: [null],
        jointsecr1: [null],
        jointsecr2: [null],
        treasurer: [null],
        councilelecteddate: [null],
        councilbegindate: [null],
        councilexpirydate: [null]
    });
        }
    });
    this.getCountries();
    this.getRegion(this.currentChurch['CCH_COUNTRY'], this.currentChurch['CTR_REGION']);
    this.getCentre(this.currentChurch['CTR_REGION'], this.currentChurch['CCH_CENTRE']);
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
    this.getMembers();


    this.presidentFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterPresidents();
      });
        
      this.vicpres1FilterCtrl.valueChanges
      .subscribe(() => {
        this.filterVicepres1();
      });
      this.vicpres2Ctrl.valueChanges
      .subscribe(() => {
        this.filterVicepres2();
      });
      this.secretaryCtrl.valueChanges
      .subscribe(() => {
        this.filterSecretary();
      });
      this.joinsecr1Ctrl.valueChanges
      .subscribe(() => {
        this.filterJoinSecretary();
      });
      this.joinsecr2Ctrl.valueChanges
      .subscribe(() => {
        this.filterJoinSecretary2();
      });
     
      this.treasurerCtrl.valueChanges
      .subscribe(() => {
        this.filterTreasurer();
      });
      
    
  });
  }
  getCountries(): any {
    this.apiService.getCountry(this.header).subscribe((data: Array<object>) => {
        this.countires = data['Data'];
        this.filteredCount.next(this.countires.slice());
        console.log(this.filteredCount);
  });
}
getRegion(countryPK: any, regionPK: any): void{
    if (countryPK != null) {
       this.regionrequest = {
           'RGN_COUNTRY': countryPK
       };
       this.apiService.getRegion(this.regionrequest, this.header).subscribe((data: Array<object>) => {
           this.regiondata = data['Data'];
           if (this.regiondata != null) {
           this.filteredRegion.next(this.regiondata.slice());
          }
         });
         this.strpPrimary.controls.ddlRegion.setValue(regionPK);
    }
}
getCentre(regionPK: any, centrePK: string): void{
    if (regionPK != '') {
        this.centrerequest = {
            'CTR_REGION': regionPK
        };
        this.apiService.getCentre(this.centrerequest,  this.header).subscribe((data: Array<object>) => {
            this.centredata = data['Data'];
            if (this.centredata != null) {
              this.filteredCentre.next(this.centredata.slice());
            }
          });
          this.strpPrimary.controls.ddlCentre.setValue(centrePK);
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
private filterPresidents(): void {
  
    let search = this.presidentFilterCtrl.value;
    if (!search) {
    // this.filteredpresident.next(this.members.slice());
    this.filteredpresident.next(this.presidentData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    const reqbody = {
       'USER_PK': 1,
       'AUTO_SEARCH': search
    };
    this.memberService.getMemberAuto(reqbody, this.header).subscribe(members => {
        this.presidentData = members['Data'];
        this.presidentData.splice(0,0,this.searchDataNull);
        this.filteredpresident.next(this.presidentData);
    });
  }
  private filterVicepres1(): void {
    let search = this.vicpres1FilterCtrl.value;
    if (!search) {
        // this.filteredVicepres1.next(this.members.slice());
        this.filteredVicepres1.next(this.vicepresident1Data.slice());
         return;
       } else {
         search = search.toLowerCase();
       }
       const reqbody = {
        'USER_PK': 1,
        'AUTO_SEARCH': search
     };
     this.memberService.getMemberAuto(reqbody, this.header).subscribe(members => {
         this.vicepresident1Data = members['Data'];
         this.vicepresident1Data.splice(0,0,this.searchDataNull);
         this.filteredVicepres1.next(this.vicepresident1Data);
     });
  }
  private filterVicepres2(): void {
  
    let search = this.vicpres2Ctrl.value;
    if (!search) {
        this.filteredVicepres2.next(this.vicepresident2Data.slice());
         return;
       } else {
         search = search.toLowerCase();
       }
       const reqbody = {
        'USER_PK': 1,
        'AUTO_SEARCH': search
     };
     this.memberService.getMemberAuto(reqbody, this.header).subscribe(members => {
         this.vicepresident2Data = members['Data'];
         this.vicepresident2Data.splice(0,0,this.searchDataNull);
         this.filteredVicepres2.next(this.vicepresident2Data);
     });
  }
  private filterTreasurer(): void {
    let search = this.treasurerCtrl.value;
    if (!search) {
        this.filteredTreasurer.next(this.treasureData.slice());
         return;
       } else {
         search = search.toLowerCase();
       }
       const reqbody = {
        'USER_PK': 1,
        'AUTO_SEARCH': search
     };
     this.memberService.getMemberAuto(reqbody, this.header).subscribe(members => {
         this.treasureData = members['Data'];
         this.treasureData.splice(0,0,this.searchDataNull);
         this.filteredTreasurer.next(this.treasureData);
     });
    
}
private filterJoinSecretary(): void {
  
    let search = this.joinsecr1Ctrl.value;
    if (!search) {
        this.filteredJointsec1.next(this.jointSec1Data.slice());
         return;
       } else {
         search = search.toLowerCase();
       }
       const reqbody = {
        'USER_PK': 1,
        'AUTO_SEARCH': search
     };
     this.memberService.getMemberAuto(reqbody, this.header).subscribe(members => {
         this.jointSec1Data = members['Data'];
         this.jointSec1Data.splice(0,0,this.searchDataNull);
         this.filteredJointsec1.next(this.jointSec1Data);
     });
 
}
private filterJoinSecretary2(): void {
  
    let search = this.joinsecr2Ctrl.value;
    if (!search) {
        this.filteredJointsec2.next(this.joinSec2Data.slice());
         return;
       } else {
         search = search.toLowerCase();
       }
       const reqbody = {
        'USER_PK': 1,
        'AUTO_SEARCH': search
     };
     this.memberService.getMemberAuto(reqbody, this.header).subscribe(members => {
         this.joinSec2Data = members['Data'];
         this.joinSec2Data.splice(0,0,this.searchDataNull);
         this.filteredJointsec2.next(this.joinSec2Data);
     });
    

}
private filterSecretary(): void {
    let search = this.secretaryCtrl.value;
    if (!search) {
        this.filteredSecretary.next(this.secretaryData.slice());
         return;
       } else {
         search = search.toLowerCase();
       }
       const reqbody = {
        'USER_PK': 1,
        'AUTO_SEARCH': search
     };
     this.memberService.getMemberAuto(reqbody, this.header).subscribe(members => {
         this.secretaryData = members['Data'];
         this.secretaryData.splice(0,0,this.searchDataNull);
         this.filteredSecretary.next(this.secretaryData);
     });
}
  getMembers(): any {
    this.filteredpresident.next(this.presidentData.slice());
    this.filteredVicepres1.next(this.vicepresident1Data.slice());
    this.filteredVicepres2.next(this.vicepresident2Data.slice());
    this.filteredSecretary.next(this.secretaryData.slice());
    this.filteredTreasurer.next(this.treasureData.slice());
    this.filteredJointsec1.next(this.jointSec1Data.slice());
    this.filteredJointsec2.next(this.joinSec2Data.slice());
  }
  onCountrySelect(): any {
    this.strpPrimary.controls.ddlRegion.reset();
    this.strpPrimary.controls.ddlCentre.reset();
    this.filteredRegion.next([]);
    this.filteredCentre.next([]);
               this.regionrequest = {
                   'RGN_COUNTRY': this.strpPrimary.value.ddlCountry
               };
   this.apiService.getRegion(this.regionrequest, this.header).subscribe((data: Array<object>) => {
    this.regiondata = data['Data'];
    console.log(this.regiondata);
    if (this.regiondata != null) {
    this.filteredRegion.next(this.regiondata.slice());
   }
  });
   
}
onRegionSelect(): void {
    
    this.strpPrimary.controls.ddlCentre.reset();
    
    this.filteredCentre.next([]);
    this.centrerequest = {
                           'CTR_REGION': this.strpPrimary.value.ddlRegion
                         };
    this.apiService.getCentre(this.centrerequest,  this.header).subscribe((data: Array<object>) => {
    this.centredata = data['Data'];
    console.log(this.centredata);
    if (this.centredata != null) {
      this.filteredCentre.next(this.centredata.slice());
    }
  //  this.regionfieldset = true;
  });

}
checkcountryselection(): void {
    if (this.strpPrimary.value.ddlCountry === '') {
       alert('Please Select the country');
    }
   }
   checkCntryandRegselection(): void {
       if (this.strpPrimary.value.ddlCountry === '' && this.strpPrimary.value.ddlRegion === '' ) {
           alert('Please Select the Country and Region');
        }else if (this.strpPrimary.value.ddlRegion === '') {
           alert('Please Select the Region');
        } 
   }
  register(): any {
   if (this.registerid == Type.editchurch){
      this.moddate = this.currentChurch['LAST_MOD_DT'];
      this.saveRequest = {
        'CCH_ID': this.strpPrimary.value.churchID,
        'CCH_PK':  this.currentChurch['CCH_PK'],
        'CCH_REG_DATE': this.strpPrimary.value.txtDateReg,
        'CCH_NAME': this.strpPrimary.value.txtName,
        'CCH_DESC': '',
        'CCH_ADDR1': this.strpPrimary.value.txtStreet,
        'CCH_ADDR2': '',
        'CCH_CITY': this.strpPrimary.value.txtCity,
        'CCH_STATE': this.strpPrimary.value.txtState,
        'CCH_COUNTRY':  this.strpPrimary.value.ddlCountry,
        'CCH_REGION': this.strpPrimary.value.ddlRegion,
        'CCH_CENTRE': this.strpPrimary.value.ddlCentre,
        'CCH_MOBIL': this.strpPrimary.value.txtMobile,
        'CCH_EMAIL': this.strpPrimary.value.txtEmail,
        'CCH_PRESIDENT': this.stprTeritary.value.president  > 0 ? this.stprTeritary.value.president : null,
        'CCH_VICE_PRESIDENT1':   this.stprTeritary.value.vicpres1   > 0 ? this.stprTeritary.value.vicpres1 : null,
        'CCH_VICE_PRESIDENT2':  this.stprTeritary.value.vicpres2 > 0 ? this.stprTeritary.value.vicpres2 : null,
        'CCH_SECRETARY':  this.stprTeritary.value.secretary > 0 ? this.stprTeritary.value.secretary : null,
        'CCH_JOINT_SECRETARY1':  this.stprTeritary.value.jointsecr1 > 0 ? this.stprTeritary.value.jointsecr1 : null,
        'CCH_JOINT_SECRETARY2':  this.stprTeritary.value.jointsecr2 > 0 ? this.stprTeritary.value.jointsecr2 : null,
        'CCH_TREASURER':  this.stprTeritary.value.treasurer > 0 ? this.stprTeritary.value.treasurer : null,
        'CCH_COUNCIL_ELECTED_DATE': this.stprTeritary.value.councilelecteddate,
        'CCH_COUNCIL_BEGIN_DATE': this.stprTeritary.value.councilbegindate,
        'CCH_COUNCIL_EXPIRY_DATE': this.stprTeritary.value.councilexpirydate,
        'CCH_ACTIVE': 1,
        'USER_PK': 1,
        'LAST_MOD_DT': this.moddate
       };
   }else{
   this.moddate = new Date().toISOString();
   this.saveRequest = {
    'CCH_ID': this.strpPrimary.value.churchID,
    'CCH_PK':  0,
    'CCH_REG_DATE': this.strpPrimary.value.txtDateReg,
    'CCH_NAME': this.strpPrimary.value.txtName,
    'CCH_DESC': '',
    'CCH_ADDR1': this.strpPrimary.value.txtStreet,
    'CCH_ADDR2': '',
    'CCH_CITY': this.strpPrimary.value.txtCity,
    'CCH_STATE': this.strpPrimary.value.txtState,
    'CCH_COUNTRY':  this.strpPrimary.value.ddlCountry,
    'CCH_REGION': this.strpPrimary.value.ddlRegion,
    'CCH_CENTRE': this.strpPrimary.value.ddlCentre,
    'CCH_MOBIL': this.strpPrimary.value.txtMobile,
    'CCH_EMAIL': this.strpPrimary.value.txtEmail,
    'CCH_PRESIDENT': this.stprTeritary.value.president,
    'CCH_VICE_PRESIDENT1':   this.stprTeritary.value.vicpres1,
    'CCH_VICE_PRESIDENT2':  this.stprTeritary.value.vicpres2,
    'CCH_SECRETARY':  this.stprTeritary.value.secretary,
    'CCH_JOINT_SECRETARY1':  this.stprTeritary.value.jointsecr1,
    'CCH_JOINT_SECRETARY2':  this.stprTeritary.value.jointsecr2,
    'CCH_TREASURER':  this.stprTeritary.value.treasurer,
    'CCH_COUNCIL_ELECTED_DATE': this.stprTeritary.value.councilelecteddate,
    'CCH_COUNCIL_BEGIN_DATE': this.stprTeritary.value.councilbegindate,
    'CCH_COUNCIL_EXPIRY_DATE': this.stprTeritary.value.councilexpirydate,
    'CCH_ACTIVE': 1,
    'USER_PK': 1,
    'LAST_MOD_DT': this.moddate
   };
   }
   console.log(this.saveRequest);
   this.apiService.registerChurch(this.saveRequest,  this.header).subscribe((data: Array<object>) => {
       
    console.log(data);
    if (data['Data'] > 0) {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        if (this.registerid == Type.editchurch){
            this.confirmDialogRef.componentInstance.Message = 'Church Details Edited succesfully';
        }else {
            this.confirmDialogRef.componentInstance.Message = 'Church is registered succesfully';
        }
      
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
            this.router.navigate(['/churchlist']);
        }
        this.confirmDialogRef = null;
    });
    }else {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.isError = true;
        if (this.registerid == Type.editchurch){
            if (data['Data'] === -1){
                this.confirmDialogRef.componentInstance.Message = 'Error in Church Edition Please Try again';
            }else if (data['Data'] === -2) {
                this.confirmDialogRef.componentInstance.Message = 'Already Exixts';
            }else if (data['Data'] === -3) {
                this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';
            }else if (data['Data'] === 0) {
                this.confirmDialogRef.componentInstance.Message = 'Record Already Exixts';
            }
            this.confirmDialogRef.afterClosed().subscribe(result => {
                if ( result )
                {
                    this.router.navigate(['/churchlist']);
                }
                this.confirmDialogRef = null;
            });
         }else {
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

    } 
    // if (data['Data'] > 0) {
    //     if (this.registerid == Type.editchurch){
    //         alert('Church Details Edited succesfully');
    //     }else {
    //         alert('Church is registered succesfully');
    //         console.log(data);
    //     }
    //     this.router.navigate(['/churchlist']);
    // }else {
    //     if (this.registerid == Type.editchurch){
    //         if (data['Data'] === -1){
    //             alert('Error in Church Edition Please Try again');
    //         }else if (data['Data'] === -2) {
    //             alert('Already Exixts');
    //         }else if (data['Data'] === -3) {
    //             alert('Another user modified this record');
    //         }
    //         this.router.navigate(['/churchlist']);
    //      }else {
    //         alert('Church registration is unsuccesfull Please try again');
    //      }
    // }
   });
  }
  goBack(): void {
    this.router.navigate(['/churchlist']);
}
toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}
}
