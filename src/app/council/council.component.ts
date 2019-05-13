import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/common/common.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import { ReplaySubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MemberService } from '../services/member/member.service';
import {AuthService} from '../authentication/auth.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import {Type} from '../utility/type';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-council',
  templateUrl: './council.component.html',
  styleUrls: ['./council.component.scss',
               '../scss/council.scss', 
               '../home/homebootstrap.scss', 
               '../home/homeanimate.scss', 
               '../home/homefont.scss',
                '../scss/settingbutton.scss']
})
export class CouncilComponent implements OnInit {
  baseUrl = environment.baseUrl;
    enbleForm: Boolean = false;
    searchForm: FormGroup;
    presidentcntrl: FormControl;
    confirmDialogRef: MatDialogRef<DialogComponent>;
    secretary: FormControl = new FormControl();
    treasurer: FormControl = new FormControl();
    vicpres1: FormControl = new FormControl();
    vicpres2: FormControl = new FormControl();
    joinsec: FormControl = new FormControl();
    dateErr: Boolean = false;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    public secretaryCtrl: FormControl = new FormControl();
    public presidentFilterCtrl: FormControl = new FormControl();
    public treasurerCtrl: FormControl = new FormControl();
    public vicpres1FilterCtrl: FormControl = new FormControl();
    public vicpres2Ctrl: FormControl = new FormControl();
    public joinsecr2Ctrl: FormControl = new FormControl();
    public filteredVicepres1: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredVicepres2: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredSecretary: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredJointsec2: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredTreasurer: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
   council: any;
   imgsrc = [];
   members: any;
   public defaultImg: String;
   public filteredMembers: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
   presidentData = [{
    'MMM_NAME1': 'Search',
    'MMM_NAME2': 'Member',
    'MMM_NAME3': '',
    'MMM_PK': 0

 }];
 vicepresident1Data = [{
    'MMM_NAME1': 'Search',
    'MMM_NAME2': 'Member',
    'MMM_NAME3': '',
    'MMM_PK': 0

 }];
 vicepresident2Data = [{
    'MMM_NAME1': 'Search',
    'MMM_NAME2': 'Member',
    'MMM_NAME3': '',
    'MMM_PK': 0

 }];
 jointSec1Data = [{
    'MMM_NAME1': 'Search',
    'MMM_NAME2': 'Member',
    'MMM_NAME3': '',
    'MMM_PK': 0

 }];
 joinSec2Data = [{
    'MMM_NAME1': 'Search',
    'MMM_NAME2': 'Member',
    'MMM_NAME3': '',
    'MMM_PK': 0

 }];
 secretaryData = [{
    'MMM_NAME1': 'Search',
    'MMM_NAME2': 'Member',
    'MMM_NAME3': '',
    'MMM_PK': 0

 }];
 treasureData = [{
    'MMM_NAME1': 'Search',
    'MMM_NAME2': 'Member',
    'MMM_NAME3': '',
    'MMM_PK': 0

 }];
  constructor(
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    private GlobalUrls: GlobalUrl,
    public _matDialog: MatDialog,
    private router: Router,
    private memberService: MemberService, 
    private _fuseSidebarService: FuseSidebarService, 
    private apiService: ApiService) {
      this.defaultImg="display-img.jpg";
     }

  ngOnInit() {
    this.getCouncil();
    this.searchForm = this._formBuilder.group({
        from: [''],
        to: [''],
    });
    this.presidentcntrl = new FormControl('');
    this.presidentFilterCtrl.valueChanges
    .subscribe(() => {
      this.filterPresidents();
    });
    this.secretaryCtrl.valueChanges
    .subscribe(() => {
      this.filterSecretary();
    });
    this.treasurerCtrl.valueChanges
    .subscribe(() => {
      this.filterTreasurer();
    });
    // this.treasurerFilterCtrl.valueChanges
    // .subscribe(() => {
    //   this.filterPresidents();
    // });
    this.vicpres1FilterCtrl.valueChanges
    .subscribe(() => {
      this.filterVicepres1();
    });
    this.vicpres2Ctrl.valueChanges
    .subscribe(() => {
      this.filterVicepres2();
    }); 
     this.joinsecr2Ctrl.valueChanges
    .subscribe(() => {
      this.filterJoinSecretary2();
    });
  }
  public getCouncil(): void {
    this.apiService.getCouncil().subscribe((data: Array<object>) => {
      console.log("Council->");
      console.log(data['Data']);
      if(data['Data']){
        this.council = data['Data'];
        console.log(this.council);
        this.imgsrc =  [ this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_PRESIDENT_PHOTO'],
                         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_SECRETARY_PHOTO'], 
                         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_TREASURER_PHOTO'],
                         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_VICE_PRESIDENT1_PHOTO'],
                         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_VICE_PRESIDENT2_PHOTO'],
                         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_JOINT_SECRETARY_PHOTO']];     
        this.presidentcntrl.setValue(this.council[0]['CEM_PRESIDENT']);
        this.secretary.setValue(this.council[0]['CEM_SECRETARY']);
        this.treasurer.setValue(this.council[0]['CEM_TREASURER']);
        this.vicpres1.setValue(this.council[0]['CEM_VICE_PRESIDENT1']);
        this.vicpres2.setValue(this.council[0]['CEM_VICE_PRESIDENT2']);
        this.joinsec.setValue(this.council[0]['CEM_JOINT_SECRETARY']);
      }
      else{
        this.council =[{'CEM_PRESIDENT':'',
        'CEM_SECRETARY': '',
        'CEM_TREASURER': '',
        'CEM_VICE_PRESIDENT1': '',
        'CEM_VICE_PRESIDENT2': '',
        'CEM_JOINT_SECRETARY': '',
        'CEM_PRESIDENT_TEXT': '',
        'CEM_SECRETARY_TEXT' :'',
        'CEM_TREASURER_TEXT' : '',
        'CEM_VICE_PRESIDENT1_TEXT' : '',
        'CEM_VICE_PRESIDENT2_TEXT' : '',
        'CEM_JOINT_SECRETARY_TEXT' : '',
        'MMM_TITLE_TEXT':'',
        'CEM_PRESIDENT_MOBIL':'',
        'CEM_PRESIDENT_EMAIL':'',
        'CEM_PRESIDENT_TITLE':'',
        'CEM_SCRETARY_TITLE':'',
        'CEM_SCRETARY_MOBIL':'',
        'CEM_SCRETARY_EMAIL':'',
        'CEM_TREASURER_TITLE':'',
        'CEM_TREASURER_MOBIL':'',
        'CEM_TREASURER_EMAIL':'',
        'CEM_VICE_PRESIDENT1_TITLE':'',
        'CEM_VICE_PRESIDENT1_MOBIL':'',
        'CEM_VICE_PRESIDENT1_EMAIL':'',
        'CEM_VICE_PRESIDENT2_TITLE':'',
        'CEM_VICE_PRESIDENT2_MOBIL':'',
        'CEM_VICE_PRESIDENT2_EMAIL':'',
        'CEM_JOINT_SECRETARY_TITLE':'',
        'CEM_JOINT_SECRETARY_MOBIL':'',
        'CEM_JOINT_SECRETARY_EMAIL':''





      }];
      // this.presidentcntrl.setValue(0);
      // this.secretary.setValue(this.council[0]['CEM_SECRETARY']);
      // this.treasurer.setValue(this.council[0]['CEM_TREASURER']);
      // this.vicpres1.setValue(this.council[0]['CEM_VICE_PRESIDENT1']);
      // this.vicpres2.setValue(this.council[0]['CEM_VICE_PRESIDENT2']);
      // this.joinsec.setValue(this.council[0]['CEM_JOINT_SECRETARY']);
         this.imgsrc =  [ this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg,
        this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg, 
        this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg,
        this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg,
        this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg,
        this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg]; 
      }
    
    });
  
}
forEdit(): void{
this.enbleForm = true;
this.getMembers();
}
onSubmit(): void{
    console.log(this.council);
    const reqbody= {
        'CEM_PK': this.council[0]['CEM_PK'],
        'CEM_PRESIDENT': this.presidentcntrl.value,
        'CEM_SECRETARY': this.secretary.value,
        'CEM_TREASURER': this.treasurer.value,
        'CEM_VICE_PRESIDENT1': this.vicpres1.value,
        'CEM_VICE_PRESIDENT2': this.vicpres2.value,
        'CEM_JOINT_SECRETARY': this.joinsec.value,
        'CEM_FROM_DATE': this.searchForm.value.from,
        'CEM_TO_DATE': this.searchForm.value.to,
        'CEM_ACTIVE': 1,
        'USER_PK': 1,
        'LAST_MOD_DT': this.council[0]['CEM_MOD_DT']
    };
    console.log(reqbody);
    console.log(this.header);
   this.apiService.saveCouncil(reqbody, this.header).subscribe((data: Array<object>) => {
       
       if (data['Data'] > 0) {
        this.confirmDialogRef = this._matDialog.open(DialogComponent, {
            disableClose: true
        });
        this.confirmDialogRef.componentInstance.Message = 'Council Updated Succesfully';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                 this.getCouncil();
                //  this.router.navigate(['/council/' + Type.councilView]);
            }
            this.confirmDialogRef = null;
        });     
       }else{
            this.confirmDialogRef = this._matDialog.open(DialogComponent, {
               disableClose: true
            });
            this.confirmDialogRef.componentInstance.isError = true;
           if (data['Data'] === -1){
            this.confirmDialogRef.componentInstance.Message = 'Error in Council Edition Please Try again';
             }else if (data['Data'] === -2) {
            this.confirmDialogRef.componentInstance.Message = 'Already Exixts';
            }else if (data['Data'] === -3) {
            this.confirmDialogRef.componentInstance.Message = 'Another user modified this record';
             }
            this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.router.navigate(['/council/' + Type.councilView]);
            }
            this.confirmDialogRef = null;
        });
       }
    });
    this.enbleForm = false;
}
getMembers(): any {
//     this.memberService.getMember().subscribe((data: Array<object>) => {
//         this.members = data['Data'];
//         this.filteredMembers.next(this.members.slice());
//         this.filteredVicepres1.next(this.members.slice());
//         this.filteredVicepres2.next(this.members.slice());
//         this.filteredSecretary.next(this.members.slice());
//         this.filteredTreasurer.next(this.members.slice());
//         this.filteredJointsec2.next(this.members.slice());
       
//   });
this.filteredMembers.next(this.presidentData.slice());
this.filteredVicepres1.next(this.vicepresident1Data.slice());
this.filteredVicepres2.next(this.vicepresident2Data.slice());
this.filteredSecretary.next(this.secretaryData.slice());
this.filteredTreasurer.next(this.treasureData.slice());
this.filteredJointsec2.next(this.joinSec2Data.slice());
  }
  private filterPresidents(): void {
  
    let search = this.presidentFilterCtrl.value;
    if (!search) {
    // this.filteredpresident.next(this.members.slice());
    this.filteredMembers.next(this.presidentData.slice());
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
        this.filteredMembers.next(this.presidentData);
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
         this.filteredTreasurer.next(this.treasureData);
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
         this.filteredSecretary.next(this.secretaryData);
     });
}

onPresidentSelect(): void {
    const getRecordReq = {
        'REC_PK': this.presidentcntrl.value
    };
    this.memberService.getRecordDetails(getRecordReq, this.header).subscribe((data: Array<object>) => {
        this.council[0]['CEM_PRESIDENT_TEXT'] = data['Data'][0]['MMM_NAME1'] + ' ' +  data['Data'][0]['MMM_NAME2'] + ' ' +  data['Data'][0]['MMM_NAME3'];
      
        this.imgsrc[0] = this.baseUrl + this.GlobalUrls.MemberImgFolder + data['Data'][0]['MMM_PHOTO'];
    });
   // console.log(this.presidentcntrl.value);
}
onSecretarySelect(): void {
    const getRecordReq = {
        'REC_PK': this.secretary.value
    };
    this.memberService.getRecordDetails(getRecordReq, this.header).subscribe((data: Array<object>) => {
        this.council[0]['CEM_SECRETARY_TEXT'] = data['Data'][0]['MMM_NAME1'] + ' ' +  data['Data'][0]['MMM_NAME2'] + ' ' +  data['Data'][0]['MMM_NAME3'];
        this.imgsrc[1] = this.baseUrl + this.GlobalUrls.MemberImgFolder + data['Data'][0]['MMM_PHOTO'];
    });
}
onTreasurerSelect(): void {
    const getRecordReq = {
        'REC_PK': this.treasurer.value
    };
    this.memberService.getRecordDetails(getRecordReq, this.header).subscribe((data: Array<object>) => {
        this.council[0]['CEM_TREASURER_TEXT'] = data['Data'][0]['MMM_NAME1'] + ' ' +  data['Data'][0]['MMM_NAME2'] + ' ' +  data['Data'][0]['MMM_NAME3'];
        this.imgsrc[2] = this.baseUrl + this.GlobalUrls.MemberImgFolder + data['Data'][0]['MMM_PHOTO'];
    }); 
}
onVicepres1Select(): void{
    const getRecordReq = {
        'REC_PK': this.vicpres1.value
    };
    this.memberService.getRecordDetails(getRecordReq, this.header).subscribe((data: Array<object>) => {
        this.council[0]['CEM_VICE_PRESIDENT1_TEXT'] = data['Data'][0]['MMM_NAME1'] + ' ' +  data['Data'][0]['MMM_NAME2'] + ' ' +  data['Data'][0]['MMM_NAME3'];
        this.imgsrc[3] = this.baseUrl + this.GlobalUrls.MemberImgFolder + data['Data'][0]['MMM_PHOTO'];
    }); 
}
onVicepres2Select(): void {
    const getRecordReq = {
        'REC_PK': this.vicpres2.value
    };
    this.memberService.getRecordDetails(getRecordReq, this.header).subscribe((data: Array<object>) => {
        this.council[0]['CEM_VICE_PRESIDENT2_TEXT'] = data['Data'][0]['MMM_NAME1'] + ' ' +  data['Data'][0]['MMM_NAME2'] + ' ' +  data['Data'][0]['MMM_NAME3'];
        this.imgsrc[4] = this.baseUrl + this.GlobalUrls.MemberImgFolder + data['Data'][0]['MMM_PHOTO'];
    }); 
}
onJoinsecSelect(): void{
    const getRecordReq = {
        'REC_PK': this.joinsec.value
    };
    this.memberService.getRecordDetails(getRecordReq, this.header).subscribe((data: Array<object>) => {
        this.council[0]['CEM_JOINT_SECRETARY_TEXT'] = data['Data'][0]['MMM_NAME1'] + ' ' +  data['Data'][0]['MMM_NAME2'] + ' ' +  data['Data'][0]['MMM_NAME3'];
        this.imgsrc[5] = this.baseUrl + this.GlobalUrls.MemberImgFolder + data['Data'][0]['MMM_PHOTO'];
    }); 
}
toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}
disableEdit(): void{
    this.enbleForm = false;
}
onChange(): any {
    console.log('Hello');
    console.log(this.searchForm.controls.from.value);
    if (new Date(this.searchForm.controls.from.value) > new Date()) {
       this.dateErr = true;
    }
}
}
