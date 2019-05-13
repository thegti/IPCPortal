import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { MatStepper } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import { MemberService } from '../services/member/member.service';
import { ApiService } from '../services/common/common.service';
import {AuthService} from '../authentication/auth.service';
import {CommonEditService} from '../services/common/edit.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {Type} from '../utility/type';
import {CentreSavReqModel} from '../business-object/centrebo';
@Component({
  selector: 'app-centreregistration',
  templateUrl: './centreregistration.component.html',
  styleUrls: ['./centreregistration.component.scss', '../scss/form.scss', '../scss/settingbutton.scss']
})
export class CentreregistrationComponent implements OnInit {
    stprPrimary: FormGroup;
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
    selectedcountry: any;
    regiondata: any;
    regions: any = [];
    regionrequest = {};
    saveRequest: CentreSavReqModel;
    currentCentre: any;
    registerid: any;
    moddate: any;
    isView: Boolean = false;
    confirmDialogRef: MatDialogRef<DialogComponent>;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    @ViewChild('stepper') stepper: MatStepper;
    public countryFilterCtrl: FormControl = new FormControl();
    public regionFilterCtrl: FormControl = new FormControl();
    public presidentFilterCtrl: FormControl = new FormControl();
    public vicpres1FilterCtrl: FormControl = new FormControl();
    public vicpres2Ctrl: FormControl = new FormControl();
    public secretaryCtrl: FormControl = new FormControl();
    public joinsecr1Ctrl: FormControl = new FormControl();
    public joinsecr2Ctrl: FormControl = new FormControl();
    public treasurerCtrl: FormControl = new FormControl();
    
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
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
               private commoneditService: CommonEditService,
               private memberService: MemberService,
               private authService: AuthService,
               private _fuseSidebarService: FuseSidebarService,
               public _matDialog: MatDialog,
               private router: Router,
               private act_route: ActivatedRoute) { }

  ngOnInit(): void {
    this.commoneditService.currentCentre.subscribe(message => {
        this.currentCentre = message;
      console.log(this.currentCentre);
       const modificationdate = new Date().toDateString();
       this.act_route.params.subscribe(params => {
        this.registerid = params['id'];
        if (this.registerid == Type.editcentre ) {
            if (this.currentCentre['CTR_PRESIDENT_TEXT'] !== null){
                this.presidentData = [{
                  'MMM_NAME_TEXT': this.currentCentre['CTR_PRESIDENT_TEXT'],
                    'MMM_NAME1': this.currentCentre['CTR_PRESIDENT_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentCentre['CTR_PRESIDENT']
                }];
            }
           
            if (this.currentCentre['CTR_VICE_PRESIDENT1_TEXT'] !== null){
                this.vicepresident1Data = [{
                  'MMM_NAME_TEXT': this.currentCentre['CTR_VICE_PRESIDENT1_TEXT'],
                    'MMM_NAME1': this.currentCentre['CTR_VICE_PRESIDENT1_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentCentre['CTR_VICE_PRESIDENT1']
                }];
            }
            
            if (this.currentCentre['CTR_VICE_PRESIDENT2_TEXT'] !== null){
                this.vicepresident2Data = [{
                  'MMM_NAME_TEXT': this.currentCentre['CTR_VICE_PRESIDENT2_TEXT'],
                    'MMM_NAME1': this.currentCentre['CTR_VICE_PRESIDENT2_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentCentre['CTR_VICE_PRESIDENT2']
                }];
            }
           
            if (this.currentCentre['CTR_JOINT_SECRETARY1_TEXT'] !== null){
                this.jointSec1Data = [{
                  'MMM_NAME_TEXT': this.currentCentre['CTR_JOINT_SECRETARY1_TEXT'],
                    'MMM_NAME1': this.currentCentre['CTR_JOINT_SECRETARY1_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentCentre['CTR_JOINT_SECRETARY1']
                }];
            }
           
            if (this.currentCentre['CTR_JOINT_SECRETARY2_TEXT'] !== null){
                this.joinSec2Data = [{
                  'MMM_NAME_TEXT': this.currentCentre['CTR_JOINT_SECRETARY2_TEXT'],
                    'MMM_NAME1': this.currentCentre['CTR_JOINT_SECRETARY2_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentCentre['CTR_JOINT_SECRETARY2']
                }];
            }
           
            if (this.currentCentre['CTR_SECRETARY_TEXT'] !== null){
                this.secretaryData = [{
                  'MMM_NAME_TEXT': this.currentCentre['CTR_SECRETARY_TEXT'],
                    'MMM_NAME1': this.currentCentre['CTR_SECRETARY_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentCentre['CTR_SECRETARY']
                }];
            }
            
            if (this.currentCentre['CTR_TREASURER_TEXT'] !== null){
                this.treasureData = [{
                  'MMM_NAME_TEXT': this.currentCentre['CTR_TREASURER_TEXT'],
                    'MMM_NAME1': this.currentCentre['CTR_TREASURER_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentCentre['CTR_TREASURER']
                }];
            }
           
            this.stprPrimary = this._formBuilder.group({
                centreID: [this.currentCentre['CTR_ID'], Validators.required],
                txtName: [this.currentCentre['CTR_NAME'], Validators.required],
                txDateReg: [this.currentCentre['CTR_REG_DATE'].substring(0, 10)],
                txtMobile: [this.currentCentre['CTR_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
               
                txtEmail: [this.currentCentre['CTR_EMAIL'], Validators.email],
                txtStreet: [this.currentCentre['CTR_ADDR1']],
                txtCity: [this.currentCentre['CTR_CITY']],
                txtState: [this.currentCentre['CTR_STATE']],
                ddlCountry: [this.currentCentre['CTR_COUNTRY'], Validators.required],
                ddlRegion: [this.currentCentre['CTR_REGION'], Validators.required]
              });
        
            this.stprSecondary = this._formBuilder.group({
             
            });
            
            this.stprTeritary = this._formBuilder.group({
                ddlPresident: [this.currentCentre['CTR_PRESIDENT']],
                ddlVicpres1: [this.currentCentre['CTR_VICE_PRESIDENT1']],
                ddlVicpres2: [this.currentCentre['CTR_VICE_PRESIDENT2']],
                ddlSecretary: [this.currentCentre['CTR_SECRETARY']],
                ddlJointsecr1: [this.currentCentre['CTR_JOINT_SECRETARY1']],
                ddlJointsecr2: [this.currentCentre['CTR_JOINT_SECRETARY2']],
                ddlTreasurer: [this.currentCentre['CTR_TREASURER']],
                txtCouncilelecteddate: [this.currentCentre['CTR_COUNCIL_ELECTED_DATE'].substring(0, 10)],
                txtCouncilbegindate: [this.currentCentre['CTR_COUNCIL_BEGIN_DATE'].substring(0, 10)],
                txtCouncilexpirydate: [this.currentCentre['CTR_COUNCIL_EXPIRY_DATE'].substring(0, 10)]
            });
        }else if (this.registerid == Type.viewCentre) {
            this.isView = true;
            this.presidentData = [{
              'MMM_NAME_TEXT': this.currentCentre['CTR_PRESIDENT_TEXT'],
                'MMM_NAME1': this.currentCentre['CTR_PRESIDENT_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentCentre['CTR_PRESIDENT']
            }];
            this.vicepresident1Data = [{
              'MMM_NAME_TEXT': this.currentCentre['CTR_VICE_PRESIDENT1_TEXT'],
                'MMM_NAME1': this.currentCentre['CTR_VICE_PRESIDENT1_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentCentre['CTR_VICE_PRESIDENT1']
            }];
            this.vicepresident2Data = [{
              'MMM_NAME_TEXT': this.currentCentre['CTR_VICE_PRESIDENT2_TEXT'],
                'MMM_NAME1': this.currentCentre['CTR_VICE_PRESIDENT2_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentCentre['CTR_VICE_PRESIDENT2']
            }];
            this.jointSec1Data = [{
              'MMM_NAME_TEXT': this.currentCentre['CTR_JOINT_SECRETARY1_TEXT'],
                'MMM_NAME1': this.currentCentre['CTR_JOINT_SECRETARY1_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentCentre['CTR_JOINT_SECRETARY1']
            }];
            this.joinSec2Data = [{
              'MMM_NAME_TEXT': this.currentCentre['CTR_JOINT_SECRETARY2_TEXT'],
                'MMM_NAME1': this.currentCentre['CTR_JOINT_SECRETARY2_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentCentre['CTR_JOINT_SECRETARY2']
            }];
            this.secretaryData = [{
              'MMM_NAME_TEXT': this.currentCentre['CTR_SECRETARY_TEXT'],
                'MMM_NAME1': this.currentCentre['CTR_SECRETARY_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentCentre['CTR_SECRETARY']
            }];
            this.treasureData = [{
              'MMM_NAME_TEXT': this.currentCentre['CTR_TREASURER_TEXT'],
                'MMM_NAME1': this.currentCentre['CTR_TREASURER_TEXT'],
                 'MMM_NAME2': '',
                 'MMM_NAME3': '',
                 'MMM_PK': this.currentCentre['CTR_TREASURER']
            }];
            this.stprPrimary = this._formBuilder.group({
                centreID: [this.currentCentre['CTR_ID'], Validators.required],
                txtName: [this.currentCentre['CTR_NAME'], Validators.required],
                txtDateReg: [this.currentCentre['CTR_REG_DATE'].substring(0, 10)],
                txtMobile: [this.currentCentre['CTR_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                txtEmail: [this.currentCentre['CTR_EMAIL'], Validators.email],
                txtStreet: [this.currentCentre['CTR_ADDR1']],
                txtCity: [this.currentCentre['CTR_CITY']],
                txtState: [this.currentCentre['CTR_STATE']],
                ddlCountry: [this.currentCentre['CTR_COUNTRY'], Validators.required],
                ddlRegion: [this.currentCentre['CTR_REGION'], Validators.required]
              });
        
            this.stprSecondary = this._formBuilder.group({
             
            });
            
            this.stprTeritary = this._formBuilder.group({
                ddlPresident: [this.currentCentre['CTR_PRESIDENT']],
                ddlVicpres1: [this.currentCentre['CTR_VICE_PRESIDENT1']],
                ddlVicpres2: [this.currentCentre['CTR_VICE_PRESIDENT2']],
                ddlSecretary: [this.currentCentre['CTR_SECRETARY']],
                ddlJointsecr1: [this.currentCentre['CTR_JOINT_SECRETARY1']],
                ddlJointsecr2: [this.currentCentre['CTR_JOINT_SECRETARY2']],
                ddlTreasurer: [this.currentCentre['CTR_TREASURER']],
                txtCouncilelecteddate: [this.currentCentre['CTR_COUNCIL_ELECTED_DATE'].substring(0, 10)],
                txtCouncilbegindate: [this.currentCentre['CTR_COUNCIL_BEGIN_DATE'].substring(0, 10)],
                txtCouncilexpirydate: [this.currentCentre['CTR_COUNCIL_EXPIRY_DATE'].substring(0, 10)]
            });
            this.stepper.selectedIndex = 3;
            this.stprPrimary.disable();
            this.stprSecondary.disable();
            this.stprTeritary.disable();
        }
        else {
            this.stprPrimary = this._formBuilder.group({
                centreID: ['', Validators.required],
                txtName: ['', Validators.required],
                txtDatReg: [''],
                txtMobile: ['', [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
            
                txtEmail: ['', Validators.email],
                txtStreet: [''],
                txtCity: [''],
                txtState: [''],
                ddlCountry: ['', Validators.required],
                ddlRegion: ['', Validators.required]
              });
        
            this.stprSecondary = this._formBuilder.group({
             
            });
            
            this.stprTeritary = this._formBuilder.group({
                ddlPresident: [null],
                ddlVicpres1: [null],
                ddlVicpres2: [null],
                ddlSecretary: [null],
                ddlJointsecr1: [null],
                ddlJointsecr2: [null],
                ddlTreasurer: [null],
                txtCouncilelecteddate: [null],
                txtCouncilbegindate: [null],
                txtCouncilexpirydate: [null]
            });
        }
      });
      this.getCountries();
      this.getRegion(this.currentCentre['CTR_COUNTRY'], this.currentCentre['CTR_REGION']);
      this.countryFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterCounts();
      });
      this.regionFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterRegions();
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
         this.stprPrimary.controls.ddlRegion.setValue(regionPK);
    }
}
onCountrySelect(): any {
     this.stprPrimary.controls.ddlRegion.reset();
    this.filteredRegion.next([]);
    this.regionrequest = {
                             'RGN_COUNTRY': this.stprPrimary.value.ddlCountry
                         };
   this.apiService.getRegion(this.regionrequest, this.header).subscribe((data: Array<object>) => {
    this.regiondata = data['Data'];
  //  console.log(this.regiondata);
    if (this.regiondata != null) {
    // for (let i = 0; i < this.regiondata.length; i++) {
    //     this.regions[i] = this.regiondata[i]['RGN_NAME'];
    // }
    this.filteredRegion.next(this.regiondata.slice());
   }
  });
   
}
checkcountryselection(): void {
    if (this.stprPrimary.controls.ddlCountry.value === '') {
       alert('Please Select the country');
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
  register(): any {
    if (this.registerid == Type.editcentre){
        this.moddate = this.currentCentre['LAST_MOD_DT'];
        this.saveRequest = {
            'CTR_ID': this.stprPrimary.value.centreID,
            'CTR_PK': this.currentCentre['CTR_PK'],
            'CTR_REG_DATE': this.stprPrimary.value.txtDateReg,
            'CTR_NAME': this.stprPrimary.value.txtName,
            'CTR_DESC': 'dsfsadfad',
            'CTR_ADDR1': this.stprPrimary.value.txtStreet,
            'CTR_ADDR2': 'mjhmhjmhjm',
            'CTR_CITY': this.stprPrimary.value.txtCity,
            'CTR_STATE': this.stprPrimary.value.txtState,
            'CTR_COUNTRY':  this.stprPrimary.value.ddlCountry,
            'CTR_REGION': this.stprPrimary.value.ddlRegion,
            'CTR_MOBIL': this.stprPrimary.value.txtMobile,
            'CTR_EMAIL': this.stprPrimary.value.txtEmail,
            'CTR_PRESIDENT':  this.stprTeritary.value.ddlPresident > 0 ? this.stprTeritary.value.ddlPresident : null,
            'CTR_VICE_PRESIDENT1':  this.stprTeritary.value.ddlVicpres1 > 0 ? this.stprTeritary.value.ddlVicpres1 :null,
            'CTR_VICE_PRESIDENT2': this.stprTeritary.value.ddlVicpres2  > 0 ? this.stprTeritary.value.ddlVicpres2 :null ,
            'CTR_SECRETARY': this.stprTeritary.value.ddlSecretary   > 0 ? this.stprTeritary.value.ddlSecretary :null,
            'CTR_JOINT_SECRETARY1': this.stprTeritary.value.ddlJointsecr1   > 0 ? this.stprTeritary.value.ddlJointsecr1 :null,
            'CTR_JOINT_SECRETARY2': this.stprTeritary.value.ddlJointsecr2   > 0 ? this.stprTeritary.value.ddlJointsecr2:null,
            'CTR_TREASURER': this.stprTeritary.value.ddlTreasurer   > 0 ? this.stprTeritary.value.ddlTreasurer:null ,
            'CTR_COUNCIL_ELECTED_DATE': this.stprTeritary.value.txtCouncilelecteddate,
            'CTR_COUNCIL_BEGIN_DATE': this.stprTeritary.value.txtCouncilbegindate,
            'CTR_COUNCIL_EXPIRY_DATE': this.stprTeritary.value.txtCouncilexpirydate,
            // 'CTR_CENTRE': 1,
            'CTR_ACTIVE': 1,
            'USER_PK': 1,
            'LAST_MOD_DT': this.moddate
        }; 
     }else{
     this.moddate = new Date().toISOString();
     this.saveRequest = { 
     'CTR_PK': 0,
     'CTR_ID': this.stprPrimary.value.centreID,
     'CTR_REG_DATE': this.stprPrimary.value.txtDateReg,
     'CTR_NAME': this.stprPrimary.value.txtName,
     'CTR_DESC': 'dsfsadfad',
     'CTR_ADDR1': this.stprPrimary.value.txtStreet,
     'CTR_ADDR2': 'mjhmhjmhjm',
     'CTR_CITY': this.stprPrimary.value.txtCity,
     'CTR_STATE': this.stprPrimary.value.txtState,
     'CTR_COUNTRY':  this.stprPrimary.value.ddlCountry,
     'CTR_REGION': this.stprPrimary.value.ddlRegion,
     'CTR_MOBIL': this.stprPrimary.value.txtMobile,
     'CTR_EMAIL': this.stprPrimary.value.txtEmail,
     'CTR_PRESIDENT': this.stprTeritary.value.ddlPresident,
     'CTR_VICE_PRESIDENT1':  this.stprTeritary.value.ddlVicpres1,
     'CTR_VICE_PRESIDENT2': this.stprTeritary.value.ddlVicpres2,
     'CTR_SECRETARY': this.stprTeritary.value.ddlSecretary,
     'CTR_JOINT_SECRETARY1': this.stprTeritary.value.ddlJointsecr1,
     'CTR_JOINT_SECRETARY2': this.stprTeritary.value.ddlJointsecr2,
     'CTR_TREASURER': this.stprTeritary.value.ddlTreasurer,
     'CTR_COUNCIL_ELECTED_DATE': this.stprTeritary.value.txtCouncilelecteddate,
     'CTR_COUNCIL_BEGIN_DATE': this.stprTeritary.value.txtCouncilbegindate,
     'CTR_COUNCIL_EXPIRY_DATE': this.stprTeritary.value.txtCouncilexpirydate,
     // 'CTR_CENTRE': 1,
     'CTR_ACTIVE': 1,
     'USER_PK': 1,
     'LAST_MOD_DT': this.moddate
     };
    }
   console.log(this.saveRequest);
   this.apiService.registerCentre(this.saveRequest,  this.header).subscribe((data: Array<object>) => {
       
    console.log(data);
    if (data['Data'] > 0) {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        if (this.registerid == Type.editcentre){
            this.confirmDialogRef.componentInstance.Message = 'Centre Details Edited succesfully';
        }else {
            this.confirmDialogRef.componentInstance.Message = 'Centre is registered succesfully';
        }
      
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
            this.router.navigate(['/centrelist']);
        }
        this.confirmDialogRef = null;
    });
    }else {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.isError = true;
        if (this.registerid == Type.editcentre){
            if (data['Data'] === -1){
                this.confirmDialogRef.componentInstance.Message = 'Error in Centre Edition Please Try again';
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
                    this.router.navigate(['/centrelist']);
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
    //     if (this.registerid == Type.editcentre){
    //         alert('Centre Details Edited succesfully');
    //     }else {
    //         alert('Centre is registered succesfully');
    //         console.log(data);
    //     }
    //     this.router.navigate(['/centrelist']);
    // }else {
    //     if (this.registerid == Type.editcentre){
    //         if (data['Data'] === -1){
    //             alert('Error in Centre Edition Please Try again');
    //         }else if (data['Data'] === -2) {
    //             alert('Already Exixts');
    //         }else if (data['Data'] === -3) {
    //             alert('Another user modified this record');
    //         }
    //         this.router.navigate(['/centrelist']);
    //      }else {
    //         alert('Centre registration is unsuccesfull Please try again');
    //      }
    // }
   });
  }
  goBack(): void {
    this.router.navigate(['/centrelist']);
}
toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}
}
