import { Inject, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { MemberService } from '../services/member/member.service';
import { ApiService } from '../services/common/common.service';
import {AuthService} from '../authentication/auth.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { EditService } from '../services/member/edit.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import {DialogComponent} from '../dialog/dialog.component';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import {Type} from '../utility/type';
import {User} from '../authentication/user.model';

@Component({
  selector: 'app-add-memberrenewal',
  templateUrl: './add-memberrenewal.component.html',
  styleUrls: ['./add-memberrenewal.component.scss']
})
export class AddMemberrenewalComponent implements OnInit {
    displayedColumns: string[] = ['checkbox', 'ID', 'Name', 'duedate', 'Mobile', 'Edit'];
    dataSource: MatTableDataSource<any>;
    alreadySelected: Array<object> = [{}];
    selectedID = [];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DialogRef: MatDialogRef<DialogComponent>;
    members: Array<object> = [];
    selectall: Boolean = false;
    enabletable: Boolean =  false;
    enableSearch: Boolean = false;
    makesearch: Boolean = false;
    pageNo = 1;
    horizontalStepperStep1: FormGroup;
    horizontalStepperStep3: FormGroup;
    getmemberlistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': null,
        'MMM_REGION': null,
        'MMM_COUNTRY': null,
        'MMM_CHURCH': null,
        'MMM_ID': null,
        'MMM_NAME': null,
        'MMM_DUE_BEFORE':null
    };
    getRecordReq = {};
    memberlist: any = []; 
    countires: Array<object>;
    country: any = [];
    regionrequest = {};
    regiondata: any;
    regions: any = [];
    centrerequest: any = {};
    centredata: any;
    centers: any = [];
    churchrequest: any = {};
    churchdata: any;
    churchs: any = [];
    currMem: any;
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    enableAll: Boolean = false;
    user: User;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public countryFilterCtrl: FormControl = new FormControl();
    public regionFilterCtrl: FormControl = new FormControl();
    public centreFilterCtrl: FormControl = new FormControl();
    public churchFilterCtrl: FormControl = new FormControl();
    public memberCtrl: FormControl = new FormControl();
    public filteredMembers: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredCentre: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredChurch: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1); 
    constructor(private _formBuilder: FormBuilder,
                private apiService: ApiService,
                private memberService: MemberService,
                private editService: EditService,
                private authService: AuthService,
                private _fuseSidebarService: FuseSidebarService,
                public _matDialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) private _data: any,
                private router: Router,
                public matDialogRef: MatDialogRef<AddMemberrenewalComponent>,
                private GlobalUrls: GlobalUrl) {

     // this.getMembers();
      this.alreadySelected = _data.list;
  
      console.log(this.alreadySelected);

    }
  
ngOnInit(): void {
    this.editService.changeMember(this.editService.member);
    this.horizontalStepperStep3 = this._formBuilder.group({
        country: [null],
        region: [null],
        centre: [null],
        church: [null],
        member_id: [null],
        member_name: [null],
        dueBefore: [null]
    });
  this.getmembers(); 
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
  this.churchFilterCtrl.valueChanges
  .subscribe(() => {
    this.filterChurches();
  });
  this.memberCtrl.valueChanges
  .subscribe(() => {
    this.filterMember();
  });
    }
    getMembers(): void {
        this.user = this.authService.getUser();
        this.memberService.getMemberpageList(this.getmemberlistrequest, this.header).subscribe((data: Array<object>) => {
            this.memberlist = data['Data'];
            this.enabletable = true;
            console.log(this.memberlist);
            for (let j = 0; j < this.alreadySelected.length ; j++) {
                for (let k = 0; k <  this.memberlist.length ; k++) {
                    if (this.alreadySelected[j]['MMM_ID'] ===  this.memberlist[k]['MMM_ID']){
                           this.memberlist[k]['checked'] = true;
                    }
                }
             //   this.selectedID.push(this.alreadySelected[j]);
            }
            for (let i = 0; i < this.alreadySelected.length ; i++){
                this.selectedID.push(this.alreadySelected[i]);
               }
            console.log(this.selectedID);
            this.dataSource = new MatTableDataSource(this.memberlist);
        });
       
    }
    getMemberList(memberlistReq): any {
      this.memberService.getMemberpageList(memberlistReq, this.header).subscribe((data: Array<object>) => {
        this.memberlist = data['Data'];
        if (this.memberlist !== null) {
            for (let j = 0; j < this.selectedID.length ; j++) {
                for (let k = 0; k <  this.memberlist.length ; k++) {
                    if (this.selectedID[j]['MMM_ID'] ===  this.memberlist[k]['MMM_ID']){
                           this.memberlist[k]['checked'] = true;
                    }
                }
            }
        }
     
      this.dataSource = new MatTableDataSource(this.memberlist);
    });
    memberlistReq = {
        'PAGE_NO':  this.pageNo + 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'MMM_CENTRE': this.horizontalStepperStep3.value.centre,
        'MMM_REGION': this.horizontalStepperStep3.value.region,
        'MMM_COUNTRY': this.horizontalStepperStep3.value.country,
        'MMM_CHURCH': this.horizontalStepperStep3.value.church
    };
    this.memberService.getMemberpageList(memberlistReq, this.header).subscribe((data: Array<object>) => {
        if (data['Data'] === null) {
           this.disablenext = true;
        }else {
            this.disablenext = false;  
        }
    });
}
getmembers(): any {
    this.memberService.getMember().subscribe((data: Array<object>) => {
       this.members = data['Data'];
       console.log(this.members);
       this.filteredMembers.next(this.members.slice());

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
    // nextPage(): any {
       
    //     this.pageNo += 1;
    //     this.disableprev = false;
    //     this.getmemberlistrequest = {
    //         // 'PAGE_NO':  this.pageNo,
    //         // 'PAGE_SIZE' : this.GlobalUrls.pageSize,
    //         'USER_PK': 1,
    //         'MMM_CENTRE': this.horizontalStepperStep3.value.centre,
    //         'MMM_REGION': this.horizontalStepperStep3.value.region,
    //         'MMM_COUNTRY': this.horizontalStepperStep3.value.country,
    //         'MMM_CHURCH': this.horizontalStepperStep3.value.church
    //     };
    //     console.log( this.getmemberlistrequest);
    //     this.getMemberList(this.getmemberlistrequest);
    // }
    // previousPage(): any {
    //     this.pageNo -= 1;
    //     this.disablenext = false;
    //     if (this.pageNo < 2) {
    //         this.disableprev = true;
    //      }
    //     this.getmemberlistrequest = {
    //         'PAGE_NO':  this.pageNo,
    //         'PAGE_SIZE' : this.GlobalUrls.pageSize,
    //         'USER_PK': 1,
    //         'MMM_CENTRE': this.horizontalStepperStep3.value.centre,
    //         'MMM_REGION': this.horizontalStepperStep3.value.region,
    //         'MMM_COUNTRY': this.horizontalStepperStep3.value.country,
    //         'MMM_CHURCH': this.horizontalStepperStep3.value.church
    //     };
    //     console.log( this.getmemberlistrequest);
      
    //     this.getMemberList(this.getmemberlistrequest);
      

    // } 
    getCountries(): any {
        this.apiService.getCountry(this.header).subscribe((data: Array<object>) => {
            this.countires = data['Data'];
            this.filteredCount.next(this.countires.slice());
      });
    }
    filterMembers(): void {
        console.log(this.selectedID);
        this.pageNo = 1;
        this.disableprev = true;
       this.getmemberlistrequest = {
        'PAGE_NO':  null,
        'PAGE_SIZE' : null,
        'USER_PK': 1,
        'MMM_CENTRE': this.horizontalStepperStep3.value.centre,
        'MMM_REGION': this.horizontalStepperStep3.value.region,
        'MMM_COUNTRY': this.horizontalStepperStep3.value.country,
        'MMM_CHURCH': this.horizontalStepperStep3.value.church,
        'MMM_ID': this.horizontalStepperStep3.value.member_id,
        'MMM_NAME': this.horizontalStepperStep3.value.member_name,
        'MMM_DUE_BEFORE': this.horizontalStepperStep3.value.dueBefore
       };
       console.log(this.getmemberlistrequest);
       this.memberService.getRenewList(this.getmemberlistrequest, this.header).subscribe((data) => {
           this.memberlist = data['Data'];
           console.log(this.memberlist); 
           if (this.memberlist.length > 0) {
               this.enabletable = true;
            for (let j = 0; j < this.alreadySelected.length ; j++) {
                for (let k = 0; k <  this.memberlist.length ; k++) {
                    if (this.alreadySelected[j]['MMM_ID'] ===  this.memberlist[k]['MMM_ID']){
                           this.memberlist[k]['checked'] = true;
                    }
                }
                this.selectedID.push(this.alreadySelected[j]);
            }
            this.dataSource = new MatTableDataSource(this.memberlist);
           }  
        
       });
    }

    onCountrySelect(): any {
        this.makesearch = true;
        this.horizontalStepperStep3.controls.region.reset();
        this.horizontalStepperStep3.controls.centre.reset();
        this.horizontalStepperStep3.controls.church.reset();
        this.filteredRegion.next([]);
        this.filteredCentre.next([]);
        this.filteredChurch.next([]);
        this.regionrequest = {
                                'RGN_COUNTRY':  this.horizontalStepperStep3.value.country
                              };
       this.apiService.getRegion(this.regionrequest, this.header).subscribe((data: Array<object>) => {
        this.regiondata = data['Data'];
        if (this.regiondata != null) {
        this.filteredRegion.next(this.regiondata.slice());
       }
      });
       
    }
    onRegionSelect(): void {
        
        this.horizontalStepperStep3.controls.centre.reset();
        this.horizontalStepperStep3.controls.church.reset();
        this.filteredCentre.next([]);
        this.filteredChurch.next([]);
        this.centrerequest = {
                                'CTR_REGION':  this.horizontalStepperStep3.value.region
                             };
       this.apiService.getCentre(this.centrerequest, this.header).subscribe((data: Array<object>) => {
        this.centredata = data['Data'];
        if (this.centredata != null) {
          this.filteredCentre.next(this.centredata.slice());
        }
      });
    
    }
    onCentreSelect(): void {
        this.horizontalStepperStep3.controls.church.reset();
        this.filteredChurch.next([]);
        this.churchrequest = {
                                  'CCH_CENTRE': this.horizontalStepperStep3.value.centre
                              };
     
       this.apiService.getChurch(this.churchrequest,  this.header).subscribe((data: Array<object>) => {
        this.churchdata = data['Data'];
        if (this.churchdata != null) {
          this.filteredChurch.next(this.churchdata.slice());
        }
      });
     
    } 
    private filterMember(): void {
        let search = this.memberCtrl.value;
        if (!search) {
            // this.filteredMembers.next(this.memberlist.slice());
            this.filteredMembers.next(this.members.slice());
             return;
           } else {
             search = search.toLowerCase();
           }
        
           this.filteredMembers.next(
             this.members.filter(member => {
               if (member['MMM_NAME1'].toLowerCase().indexOf(search) === 0){
                  return member;
               }else if (member['MMM_NAME2'] != '' && member['MMM_NAME2'] != null) {
                   if (member['MMM_NAME2'].toLowerCase().indexOf(search) === 0){
                       return member;
                   }else if ((member['MMM_NAME1'] + ' ' + member['MMM_NAME2']).toLowerCase().indexOf(search) === 0){
                    return member;
                    }else if ((member['MMM_NAME1'] + ' ' + member['MMM_NAME2'] + ' ' + member['MMM_NAME3']).toLowerCase().indexOf(search) === 0){
                        return member;
                        }
                       // const name =;
                     
                  // }
               }else if (member['MMM_NAME3'] != '' && member['MMM_NAME3'] != null) {
                if (member['MMM_NAME3'].toLowerCase().indexOf(search) === 0){
                    return member;
                }else{
                    const name = member['MMM_NAME1'] + ' ' + member['MMM_NAME3'];
                    if (name.toLowerCase().indexOf(search)  === 0){
                         return member;
                    }
                }
              }
             })
           );
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
    closeFun(): any {
        this.enableSearch = false;
        this.horizontalStepperStep3.reset();
        console.log(this.horizontalStepperStep3.value);
        
    }
    checkcountryselection(): void {
        if (this.horizontalStepperStep3.value.country === '') {
           alert('Please Select the country');
        }
       }
       checkCntryandRegselection(): void {
           if (this.horizontalStepperStep3.value.country === '' && this.horizontalStepperStep3.value.region === '' ) {
               alert('Please Select the Country and Region');
            }else if (this.horizontalStepperStep3.value.region === '') {
               alert('Please Select the Region');
            } 
       }
       checkrequiredfields(): void {
           if (this.horizontalStepperStep3.value.country === '' && this.horizontalStepperStep3.value.region === '' && this.horizontalStepperStep3.value.centre === '') {
               alert('Please Select the Country,Region and Centre first');
            }else if (this.horizontalStepperStep3.value.region === '' && this.horizontalStepperStep3.value.centre === '') {
               alert('Please Select the Region and Centre');
            }else if (this.horizontalStepperStep3.value.centre === '') {
               alert('Please Select the Centre');
            } 
       }

addmembernav(): void {
        this.router.navigate(['/registration/' + Type.Member] );
    }
toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}
onSelection(value): void {
    console.log(value);
    console.log(this.selectedID);
    for (let i = 0; i < this.selectedID.length; i++){
        if (this.selectedID[i]['MMM_ID'] === value['MMM_ID']) {
            this.selectedID.splice(i, 1);
            console.log(this.selectedID);
            return;
        }
    }
    // for (let i = 0; i < this.alreadySelected.length; i++){
    //     if (this.alreadySelected[i]['MMM_ID'] === value['MMM_ID']) {
    //         // this.selectedID.splice(i, 1);
    //         // console.log(this.selectedID);
    //         return;
    //     }
    // }
    this.selectedID.push(value);
    console.log(this.selectedID);
}
selectAll(): void {
    this.selectall = !this.selectall;
    if ( this.selectall === true) {
        for (let i = 0; i < this.memberlist.length ; i++) {
            this.memberlist[i]['checked'] = true;
        }
        this.selectedID = this.memberlist;
        console.log(this.selectedID);
    }else{
        for (let i = 0; i < this.memberlist.length ; i++) {
            this.memberlist[i]['checked'] = false;
        }
    }
   }
addMemberforRenew(): void {
   console.log(this.selectedID);
   console.log(this.alreadySelected);
//    for (let i = 0; i < this.alreadySelected.length ; i++){
//     this.selectedID.push(this.alreadySelected[i]);
//    }
    this.editService.changeRenewList(this.selectedID);
    this.matDialogRef.close();
   
}
  }
  

