import { Component, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { MatStepper } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MemberService } from '../services/member/member.service';
import {AuthService} from '../authentication/auth.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import { ApiService } from '../services/common/common.service';
import {CommonEditService} from '../services/common/edit.service';
import {Type} from '../utility/type';
import {RegionSaveReqModel} from '../business-object/regionbo';
@Component({
  selector: 'app-regionregistration',
  templateUrl: './regionregistration.component.html',
  styleUrls: ['./regionregistration.component.scss', '../scss/form.scss', '../scss/settingbutton.scss']
})
export class RegionregistrationComponent implements OnInit {
    selectedIndex = 0;
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
        'MMM_NAME1': 'Search',
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
    saveRequest: RegionSaveReqModel;
    currentRegion: any;
    registerid: any;
    moddate: any;
    isView: Boolean = false;
    confirmDialogRef: MatDialogRef<DialogComponent>;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } }; 
    @ViewChild('stepper') stepper: MatStepper;
    public countryFilterCtrl: FormControl = new FormControl();
    public presidentFilterCtrl: FormControl = new FormControl();
    public vicpres1FilterCtrl: FormControl = new FormControl();
    public vicpres2Ctrl: FormControl = new FormControl();
    public secretaryCtrl: FormControl = new FormControl();
    public joinsecr1Ctrl: FormControl = new FormControl();
    public joinsecr2Ctrl: FormControl = new FormControl();
    public treasurerCtrl: FormControl = new FormControl();
    
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
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
               private authService: AuthService,
               private commoneditService: CommonEditService,
               private memberService: MemberService,
               private _fuseSidebarService: FuseSidebarService,
               public _matDialog: MatDialog,
               private act_route: ActivatedRoute,
               private router: Router) { }

  ngOnInit(): void {
     
    this.commoneditService.currentRegion.subscribe(message => {
        this.currentRegion = message;
        console.log( this.currentRegion);
       this.act_route.params.subscribe(params => {
        this.registerid = params['id'];
        if (this.registerid == Type.editregion) {
            if (this.currentRegion['RGN_PRESIDENT_TEXT'] !== null){
                this.presidentData = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_PRESIDENT_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_PRESIDENT_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_PRESIDENT']
                }];
            }
            if (this.currentRegion['RGN_VICE_PRESIDENT1_TEXT'] !== null){
                this.vicepresident1Data = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_VICE_PRESIDENT1_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_VICE_PRESIDENT1_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_VICE_PRESIDENT1']
                }];
            }
            if (this.currentRegion['RGN_VICE_PRESIDENT2_TEXT'] !== null){
                this.vicepresident2Data = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_VICE_PRESIDENT2_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_VICE_PRESIDENT2_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_VICE_PRESIDENT2']
                }];
            }
            if (this.currentRegion['RGN_JOINT_SECRETARY1_TEXT'] !== null){
                this.jointSec1Data = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_JOINT_SECRETARY1_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_JOINT_SECRETARY1_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_JOINT_SECRETARY1']
                }];
            }
            if (this.currentRegion['RGN_JOINT_SECRETARY2_TEXT'] !== null){
                this.joinSec2Data = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_JOINT_SECRETARY2_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_JOINT_SECRETARY2_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_JOINT_SECRETARY2']
                }];
            }
           
            if (this.currentRegion['RGN_SECRETARY_TEXT'] !== null){
               
                this.secretaryData = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_SECRETARY_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_SECRETARY_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_SECRETARY']
                }];
            }
            if (this.currentRegion['RGN_TREASURER_TEXT'] != null){
              
                this.treasureData = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_TREASURER_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_TREASURER_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_TREASURER']
                }];
            }

            this.stprPrimary = this._formBuilder.group({
                RegionID: [this.currentRegion['RGN_ID'], Validators.required],
                txtName: [this.currentRegion['RGN_NAME'], Validators.required],
                txtDateRg: [this.currentRegion['RGN_REG_DATE'].substring(0, 10)],
                txtMobile: [this.currentRegion['RGN_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                
                txtEmail: [this.currentRegion['RGN_EMAIL'], Validators.email],
              //  address: this._formBuilder.array([this._formBuilder.group({ street: '', city: '', state: '', country: ['', Validators.required]})]),
              txtStreet: [this.currentRegion['RGN_ADDR1']],
              txtCity: [this.currentRegion['RGN_ADDR2']],
              txtState: [this.currentRegion['RGN_STATE']],
              ddlCountry: [this.currentRegion['RGN_COUNTRY'], Validators.required],  
            });
        
            this.stprSecondary = this._formBuilder.group({
             
            });
            
            this.stprTeritary = this._formBuilder.group({
              ddlPresident: [this.currentRegion['RGN_PRESIDENT']],
              ddlVicpres1: [this.currentRegion['RGN_VICE_PRESIDENT1']],
              ddlVicpres2: [this.currentRegion['RGN_VICE_PRESIDENT2']],
              ddlSecretary: [this.currentRegion['RGN_SECRETARY']],
              ddlJointsecr1: [this.currentRegion['RGN_JOINT_SECRETARY1']],
              ddlJointsecr2: [this.currentRegion['RGN_JOINT_SECRETARY2']],
              ddlTreasurer: [this.currentRegion['RGN_TREASURER']],
              ddlCouncilelectedDate: [this.currentRegion['RGN_COUNCIL_ELECTED_DATE'].substring(0, 10)],
              ddlCouncilBeginDate: [this.currentRegion['RGN_COUNCIL_BEGIN_DATE'].substring(0, 10)],
              ddlCouncilExpiryDate: [this.currentRegion['RGN_COUNCIL_EXPIRY_DATE'].substring(0, 10)]
                
            });
        }else if (this.registerid == Type.viewRegion) {
            this.isView = true;
            if (this.currentRegion['RGN_PRESIDENT_TEXT'] !== null){
                this.presidentData = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_PRESIDENT_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_PRESIDENT_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_PRESIDENT']
                }];
            }
            if (this.currentRegion['RGN_VICE_PRESIDENT1_TEXT'] !== null){
                this.vicepresident1Data = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_VICE_PRESIDENT1_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_VICE_PRESIDENT1_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_VICE_PRESIDENT1']
                }];
            }
            if (this.currentRegion['RGN_VICE_PRESIDENT2_TEXT'] !== null){
                this.vicepresident2Data = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_VICE_PRESIDENT2_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_VICE_PRESIDENT2_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_VICE_PRESIDENT2']
                }];
            }
            if (this.currentRegion['RGN_JOINT_SECRETARY1_TEXT'] !== null){
                this.jointSec1Data = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_JOINT_SECRETARY1_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_JOINT_SECRETARY1_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_JOINT_SECRETARY1']
                }];
            }
            if (this.currentRegion['RGN_JOINT_SECRETARY2_TEXT'] !== null){
                this.joinSec2Data = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_JOINT_SECRETARY2_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_JOINT_SECRETARY2_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_JOINT_SECRETARY2']
                }];
            }
          
            if (this.currentRegion['RGN_SECRETARY_TEXT'] !== null){
               
                this.secretaryData = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_SECRETARY_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_SECRETARY_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_SECRETARY']
                }];
            }
            
            if (this.currentRegion['RGN_TREASURER_TEXT'] != null){
              
                this.treasureData = [{
                  'MMM_NAME_TEXT': this.currentRegion['RGN_TREASURER_TEXT'],
                    'MMM_NAME1': this.currentRegion['RGN_TREASURER_TEXT'],
                     'MMM_NAME2': '',
                     'MMM_NAME3': '',
                     'MMM_PK': this.currentRegion['RGN_TREASURER']
                }];
            }
            
            this.stprPrimary = this._formBuilder.group({
                RegionID: [this.currentRegion['RGN_ID'], Validators.required],
                txtName: [this.currentRegion['RGN_NAME'], Validators.required],
                txtDateRg: [this.currentRegion['RGN_REG_DATE'].substring(0, 10)],
                txtMobile: [this.currentRegion['RGN_MOBIL'], [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
                txtEmail: [this.currentRegion['RGN_EMAIL'], Validators.email],
              //  address: this._formBuilder.array([this._formBuilder.group({ street: '', city: '', state: '', country: ['', Validators.required]})]),
              txtStreet: [this.currentRegion['RGN_ADDR1']],
              txtCity: [this.currentRegion['RGN_CITY']],
              txtState: [this.currentRegion['RGN_STATE']],
              ddlCountry: [this.currentRegion['RGN_COUNTRY'], Validators.required],  
            });
        
            this.stprSecondary = this._formBuilder.group({
             
            });
            
            this.stprTeritary = this._formBuilder.group({
              ddlPresident: [this.currentRegion['RGN_PRESIDENT']],
              ddlVicpres1: [this.currentRegion['RGN_VICE_PRESIDENT1']],
              ddlVicpres2: [this.currentRegion['RGN_VICE_PRESIDENT2']],
              ddlSecretary: [this.currentRegion['RGN_SECRETARY']],
              ddlJointsecr1: [this.currentRegion['RGN_JOINT_SECRETARY1']],
              ddlJointsecr2: [this.currentRegion['RGN_JOINT_SECRETARY2']],
              ddlTreasurer: [this.currentRegion['RGN_TREASURER']],
                ddlCouncilelectedDate: [this.currentRegion['RGN_COUNCIL_ELECTED_DATE'].substring(0, 10)],
                ddlCouncilBeginDate: [this.currentRegion['RGN_COUNCIL_BEGIN_DATE'].substring(0, 10)],
                ddlCouncilExpiryDate: [this.currentRegion['RGN_COUNCIL_EXPIRY_DATE'].substring(0, 10)]
            });
           
            // setTimeout(() => {
            this.stepper.selectedIndex = 3;
            //    console.log('Heloo');
            //   }, 0);
            this.stprPrimary.disable();
            this.stprSecondary.disable();
            this.stprTeritary.disable();
        }else {
            this.stprPrimary = this._formBuilder.group({
                RegionID: ['', Validators.required],
                txtName: ['', Validators.required],
                txtDateRg: [''],
                txtMobile: ['', [Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),Validators.minLength(10),Validators.maxLength(15)]],
              
                txtEmail: ['', Validators.email],
                txtStreet: [''],
                txtCity: [''],
                txtState: [''],
                ddlCountry: ['', Validators.required],
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
              ddlCouncilelectedDate: [null],
                ddlCouncilBeginDate: [null],
                ddlCouncilExpiryDate: [null]
            });
        }
    });
    this.getCountries();

    this.countryFilterCtrl.valueChanges
    .subscribe(() => {
      this.filterCounts();
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
//   ngAfterViewInit() {
//     // this.stepper.selectedIndex = 1; 

//     // To avoid "ExpressionChangedAfterItHasBeenCheckedError" error, 
//     // set the index in setTimeout 
//     setTimeout(() => {
//       this.stepper.selectedIndex = 2; 
//       console.log('Hello');
//     }, 0);
//   }

 getCountries(): any {
    this.apiService.getCountry(this.header).subscribe((data: Array<object>) => {
        this.countires = data['Data'];
        this.filteredCount.next(this.countires.slice());
        console.log(this.filteredCount);
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
 private filterPresidents(): void {
  //this.presidentData=this.presidentDataNull;
    let search = this.presidentFilterCtrl.value;
    console.log(search);
    if (!search) {
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
        //presidentDataNull
     
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
    
    //    this.filteredVicepres1.next(
    //      this.members.filter(member => {
    //        if (member['MMM_NAME1'].toLowerCase().indexOf(search) > -1){
    //           return member;
    //        }else if (member['MMM_NAME2'] != '' && member['MMM_NAME2'] != null) {
    //            if (member['MMM_NAME2'].toLowerCase().indexOf(search) === 0){
    //                return member;
    //            } 
    //        }
    //      })
    //    );
  }
  private filterVicepres2(): void {
  
    let search = this.vicpres2Ctrl.value;
    if (!search) {
        // this.filteredMembers.next(this.memberlist.slice());
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
        // this.filteredMembers.next(this.memberlist.slice());
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
        // this.filteredMembers.next(this.memberlist.slice());
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
        // this.filteredMembers.next(this.memberlist.slice());
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
        // this.filteredMembers.next(this.memberlist.slice());
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
    // this.memberService.getMember().subscribe((data: Array<object>) => {
    //    this.members = data['Data'];
    //   this.filteredMembers.next(this.members.slice());
     //  this.filteredpresident.next(this.members.slice());
    //    this.filteredVicepres1.next(this.members.slice());
    //    this.filteredVicepres2.next(this.members.slice());
    //    this.filteredSecretary.next(this.members.slice());
    //    this.filteredTreasurer.next(this.members.slice());
    //    this.filteredJointsec1.next(this.members.slice());
    //    this.filteredJointsec2.next(this.members.slice());

  }
  register(): any {
    if (this.registerid == Type.editregion){
        this.moddate = this.currentRegion['LAST_MOD_DT'];
        this.saveRequest = {
             'RGN_ID': this.stprPrimary.value.RegionID,
             'RGN_PK':  this.currentRegion['RGN_PK'],
             'RGN_REG_DATE': this.stprPrimary.value.txtDateRg,
             'RGN_NAME': this.stprPrimary.value.txtName,
             'RGN_DESC': '',
             'RGN_ADDR1': this.stprPrimary.value.txtStreet,
             'RGN_ADDR2': '',
             'RGN_CITY': this.stprPrimary.value.txtCity,
             'RGN_STATE': this.stprPrimary.value.txtState,
             'RGN_COUNTRY': this.stprPrimary.value.ddlCountry,
             'RGN_MOBIL': this.stprPrimary.value.txtMobile,
             'RGN_EMAIL': this.stprPrimary.value.txtEmail,
             'RGN_PRESIDENT': this.stprTeritary.value.ddlPresident > 0 ? this.stprTeritary.value.ddlPresident : null,
             'RGN_VICE_PRESIDENT1':  this.stprTeritary.value.ddlVicpres1 > 0 ? this.stprTeritary.value.ddlVicpres1 :null,
             'RGN_VICE_PRESIDENT2': this.stprTeritary.value.ddlVicpres2 > 0 ? this.stprTeritary.value.ddlVicpres2 :null,
             'RGN_SECRETARY': this.stprTeritary.value.ddlSecretary > 0 ? this.stprTeritary.value.ddlSecretary  :null,
             'RGN_JOINT_SECRETARY1': this.stprTeritary.value.ddlJointsecr1 > 0 ? this.stprTeritary.value.ddlJointsecr1 :null,
             'RGN_JOINT_SECRETARY2': this.stprTeritary.value.ddlJointsecr2 > 0 ? this.stprTeritary.value.ddlJointsecr2 :null,
             'RGN_TREASURER': this.stprTeritary.value.ddlTreasurer > 0 ? this.stprTeritary.value.ddlTreasurer :null,
             'RGN_COUNCIL_ELECTED_DATE': this.stprTeritary.value.ddlCouncilelectedDate,
             'RGN_COUNCIL_BEGIN_DATE': this.stprTeritary.value.ddlCouncilBeginDate,
             'RGN_COUNCIL_EXPIRY_DATE': this.stprTeritary.value.ddlCouncilExpiryDate,
             // 'RGN_CENTRE': 1,
             'RGN_ACTIVE': 1,
             'USER_PK': 1,
             'LAST_MOD_DT': this.moddate,
             
            };
     }else{
     this.moddate = new Date().toISOString()
     this.saveRequest = {
         'RGN_PK': 0,
         'RGN_ID': this.stprPrimary.value.RegionID,
         'RGN_REG_DATE': this.stprPrimary.value.txtDateRg,
         'RGN_NAME': this.stprPrimary.value.txtName,
         'RGN_DESC': '',
         'RGN_ADDR1': this.stprPrimary.value.txtStreet,
         'RGN_ADDR2': '',
         'RGN_CITY': this.stprPrimary.value.txtCity,
         'RGN_STATE': this.stprPrimary.value.txtState,
         'RGN_COUNTRY': this.stprPrimary.value.ddlCountry,
         'RGN_MOBIL': this.stprPrimary.value.txtMobile,
         'RGN_EMAIL': this.stprPrimary.value.txtEmail,
         'RGN_PRESIDENT': this.stprTeritary.value.ddlPresident,
         'RGN_VICE_PRESIDENT1':  this.stprTeritary.value.ddlVicpres1,
         'RGN_VICE_PRESIDENT2': this.stprTeritary.value.ddlVicpres2,
         'RGN_SECRETARY': this.stprTeritary.value.ddlSecretary,
         'RGN_JOINT_SECRETARY1': this.stprTeritary.value.ddlJointsecr1,
         'RGN_JOINT_SECRETARY2': this.stprTeritary.value.ddlJointsecr2,
         'RGN_TREASURER': this.stprTeritary.value.ddlTreasurer,
         'RGN_COUNCIL_ELECTED_DATE': this.stprTeritary.value.ddlCouncilelectedDate,
         'RGN_COUNCIL_BEGIN_DATE': this.stprTeritary.value.ddlCouncilBeginDate,
         'RGN_COUNCIL_EXPIRY_DATE': this.stprTeritary.value.ddlCouncilExpiryDate,
         // 'RGN_CENTRE': 1,
         'RGN_ACTIVE': 1,
         'USER_PK': 1,
         'LAST_MOD_DT': this.moddate
        }; 
    }
   console.log(this.saveRequest);
   this.apiService.registerRegion(this.saveRequest,  this.header).subscribe((data: Array<object>) => {
    if (data['Data'] > 0) {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        if (this.registerid == Type.editregion){
            this.confirmDialogRef.componentInstance.Message = 'Region Details Edited succesfully';
        }else {
            this.confirmDialogRef.componentInstance.Message = 'Region is registered succesfully';
        }
      
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
            this.router.navigate(['/regionlist']);
        }
        this.confirmDialogRef = null;
    });
    }else {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.isError = true;
        if (this.registerid == Type.editregion){
            if (data['Data'] === -1){
                this.confirmDialogRef.componentInstance.Message = 'Error in Region Edition Please Try again';
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
                    this.router.navigate(['/regionlist']);
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
    // console.log(data);
    // if (data['Data'] > 0) {
    //     if (this.registerid == Type.editregion){
    //         alert('Region Details Edited succesfully');
    //     }else {
    //         alert('Region is registered succesfully');
    //         console.log(data);
    //     }
    //     this.router.navigate(['/regionlist']);
    // }else {
    //     if (this.registerid == Type.editregion){
    //         if (data['Data'] === -1){
    //             alert('Error in Region Edition Please Try again');
    //         }else if (data['Data'] === -2) {
    //             alert('Already Exixts');
    //         }else if (data['Data'] === -3) {
    //             alert('Another user modified this record');
    //         }
    //         this.router.navigate(['/regionlist']);
    //      }else {
    //         alert('Region registration is unsuccesfull Please try again');
    //      }
    // }
   });
  }
  goBack(): void {
        this.router.navigate(['/regionlist']);
   }
   toggleSidebarOpen(key): void
   {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
   }
}
