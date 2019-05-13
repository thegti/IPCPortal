import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { MemberService } from '../services/member/member.service';
import { ApiService } from '../services/common/common.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { EditService } from '../services/member/edit.service';
import {AuthService} from '../authentication/auth.service';
import {CommonEditService} from '../services/common/edit.service';
import {CommonDataObject} from '../services/common/commonDataObject';
import {GlobalUrl} from '../utility/GlobalUrl';
import { ReplaySubject } from 'rxjs';
import {Observable} from 'rxjs';
import { Router,ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import {Type} from '../utility/type';
import {DialogComponent} from '../dialog/dialog.component';
import {CentreModel} from '../business-object/centrebo';
import { filter } from 'rxjs/operators';
import {FilterFields} from '../business-object/memberbo';
import { Response } from 'selenium-webdriver/http';
@Component({
  selector: 'app-centrelist',
  templateUrl: './centrelist.component.html',
  styleUrls: ['./centrelist.component.scss', '../scss/listing.scss', '../scss/settingbutton.scss']
})
export class CentrelistComponent implements OnInit {
    displayedColumns: string[] = ['ID', 'Name', 'President', 'Mobile','CTR_EMAIL', 'Edit'];
    dataSource: MatTableDataSource<any>;
    enableSearch: Boolean = false;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DialogRef:  MatDialogRef<DialogComponent>;
    pageNo = 1;
    CentreID:any;
    searchForm: FormGroup;
    centrelistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'CTR_REGION': null,
        'CTR_COUNTRY': null
    };
    countryID: any;
    regionID:any;
    getRecordReq = {};
    centrelist: CentreModel[]; 
    countires: Array<object>;
    regionrequest = {};
    regiondata: any;
    currentCentre: any;
    currentCouncil = {};
    makesearch: Boolean = false;
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    enableAll: Boolean = false;
    filterFields: FilterFields; 
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    @ViewChild(MatSort) sort: MatSort;
    public countryFilterCtrl: FormControl = new FormControl();
    public regionFilterCtrl: FormControl = new FormControl();
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    public filteredRegion: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private memberService: MemberService,
    private editService: EditService,
    private authService: AuthService,
    private _fuseSidebarService: FuseSidebarService,
    private commoneditService: CommonEditService,
    private CommondataObject: CommonDataObject,
    public _matDialog: MatDialog,
    private router: Router,
    private GlobalUrls: GlobalUrl,private act_route: ActivatedRoute) { 
     // this.subscribeToRouterParams();
        this.getCentreList();
    }

    ngOnInit(): void {

      this.editService.changeMember(this.editService.member);
      this.commoneditService.changeCentre(this.CommondataObject.centre);
      this.getCountries(this.authService.countryID);
      this.searchForm = this._formBuilder.group({
          ddlCountry: [this.authService.countryID],
          ddlRegion: [''],
          ddlCountry2: [this.authService.countryID],
      });
      this.countryFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterCounts();
      });
      this.regionFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterRegions();
      });
      //this.authService.countryID);
        this.act_route.params.subscribe(params => {
          if(params['countryID']!=null)
            this.countryID = params['countryID'];
          else
            this.countryID=0;

          if(params['regionID']!=null)
            {
              this.regionID = params['regionID'];
              if(this.countryID==0)
                this.getFilterFields({"RGN_PK": this.regionID });
            }
          else
            this.regionID=0;
         
          if(this.countryID >0 && this.regionID>0 )
          {
            this.pageNo = 1;
            this.disableprev = true;
            this.centrelistrequest = {
               'PAGE_NO':  this.pageNo,
               'PAGE_SIZE' : this.GlobalUrls.pageSize,
               'USER_PK': 1,
               'CTR_REGION': this.regionID,
               'CTR_COUNTRY': this.countryID
            };
             this.getCentres(this.centrelistrequest);
          }
        });
        //   // this.getCountries(this.countryID);
        //   // this.filteredCount.next(
        //   //   this.countires.filter(country => country['CNT_NAME'].toLowerCase().indexOf('India') > -1)
        // //);
        // });
       
     }

    //  subscribeToRouterParams(){
    //   this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe( () => {
    //     let active = this.act_route;
    //     while (active.firstChild) { active = active.firstChild };
    //     active.params.subscribe( (params: Params) => {
    //         this.countryID = params['countryID'];
    //     });
    //   });
    // }
     getCentreList(): any {
        this.apiService.getCentreList(this.centrelistrequest, this.header).subscribe((data: Array<object>) => {
            this.centrelist = data['Data'];
            console.log(this.centrelist);
            this.dataSource = new MatTableDataSource(this.centrelist);
        });
        this.centrelistrequest = {
            'PAGE_NO':  this.pageNo + 1,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
            'CTR_REGION': null,
            'CTR_COUNTRY': null
        };
        this.apiService.getCentreList(this.centrelistrequest, this.header).subscribe((data: Array<object>) => {
            if (data['Data'] === null) {
               this.disablenext = true;
            }else {
                this.disablenext = false;  
            }
        });
    }
    

    getFilterFields(ministrylistReq): any {
      this.memberService.getFilterFields(ministrylistReq, this.header).subscribe((data: Array<object>) => {
      this.filterFields = data['Data'];
      this.countryID=this.filterFields[0].CNT_PK;
      this.pageNo = 1;
      this.disableprev = true;
      this.centrelistrequest = {
         'PAGE_NO':  this.pageNo,
         'PAGE_SIZE' : this.GlobalUrls.pageSize,
         'USER_PK': 1,
         'CTR_REGION': this.regionID,
         'CTR_COUNTRY': this.countryID
      };
      
       this.getCentres(this.centrelistrequest);

      });
    }
    forcenterdrill(value): any {
     
      this.router.navigate(['/churchlist/',this.countryID,this.regionID,value['CTR_PK']]);
   }
    getCentres(reqbody): void {
      console.log('Req->');
      console.log(reqbody['CTR_COUNTRY']);
      //if(reqbody['CTR_COUNTRY']==2)
      //this.getCountries(reqbody['CTR_COUNTRY']+'');
        this.apiService.getCentreList(reqbody, this.header).subscribe((data: Array<object>) => {
            this.centrelist = data['Data'];
            this.dataSource = new MatTableDataSource(this.centrelist);
        });
        reqbody = {
            'PAGE_NO':  this.pageNo + 1,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
            'CTR_REGION': this.regionID >0 ? +this.regionID: this.searchForm.value.ddlRegion,
            'CTR_COUNTRY': this.countryID >0 ? +this.countryID: this.searchForm.value.ddlCountry
        };
        this.apiService.getCentreList(reqbody, this.header).subscribe((data: Array<object>) => {
            if (data['Data'] === null) {
               this.disablenext = true;
            }else {
                this.disablenext = false;  
            }
        }); 
    }
      getCountries(val: any ): any {
        console.log('Get Country->');
        console.log(this.authService.countryID);
        this.apiService.getCountry(this.header).subscribe((data: Array<object>) => {
            this.countires = data['Data'];
            this.filteredCount.next(this.countires.slice());
             if(val>0)
             {
              this.searchForm.controls.ddlCountry2.setValue(val);
              this.searchForm.controls.ddlCountry.setValue(val);
             }
            
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
          //this.searchForm.controls.ddlCountry.setValue(this.countryID);
      }
      nextPage(): any {
         
          this.pageNo += 1;
          this.disableprev = false;
          this.centrelistrequest = {
              'PAGE_NO':  this.pageNo,
              'PAGE_SIZE' : this.GlobalUrls.pageSize,
              'USER_PK': 1,
              'CTR_REGION':  this.regionID>0 ? this.regionID: this.searchForm.value.ddlRegion,
              'CTR_COUNTRY': this.countryID>0 ? this.countryID: this.searchForm.value.ddlCountry
              
          };
         this.getCentres(this.centrelistrequest);
      }
      previousPage(): any {
          this.pageNo -= 1;
          this.disablenext = false;
          if (this.pageNo < 2) {
            this.disableprev = true; 
          }
          this.centrelistrequest = {
              'PAGE_NO':  this.pageNo,
              'PAGE_SIZE' : this.GlobalUrls.pageSize,
              'USER_PK': 1,
              'CTR_REGION':  this.regionID>0 ? this.regionID: this.searchForm.value.ddlRegion,
              'CTR_COUNTRY': this.countryID>0 ? this.countryID: this.searchForm.value.ddlCountry
          };
          this.getCentres(this.centrelistrequest);
      } 
      filterCentres(): void {
        this.pageNo = 1;
        this.disableprev = true;
        this.centrelistrequest = {
           'PAGE_NO':  this.pageNo,
           'PAGE_SIZE' : this.GlobalUrls.pageSize,
           'USER_PK': 1,
           'CTR_REGION': this.searchForm.value.ddlRegion,
           'CTR_COUNTRY': this.searchForm.value.ddlCountry
        };
         this.enableSearch = false;
         this.getCentres(this.centrelistrequest);
         this.enableAll = true;
      }
      getAllCentres(): void{
        this.pageNo = 1;
        this.disableprev = true;
        this.centrelistrequest = {
            'PAGE_NO': this.pageNo,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
            'CTR_REGION': null,
           'CTR_COUNTRY': null
        };
        this.getCentres(this.centrelistrequest);
        this.searchForm.reset();
        this.enableAll = false;
    }

  
   

      onCountrySelect(): any {
        this.makesearch = true;
        this.searchForm.controls.ddlRegion.reset();
        this.filteredRegion.next([]);
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
    closeFun(): any {
        this.enableSearch = false;
        this.searchForm.reset();
        
    }
    checkcountryselection(): void {
        if (this.searchForm.value.ddlCountry === '') {
           alert('Please Select the country');
        }
       }

       forEdit(value): any {
       this.getRecordReq = {
        'REC_PK': value['CTR_PK']
       };
       this.apiService.getCentreDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
       this.currentCentre = data['Data'][0];
       this.commoneditService.changeCentre(this.currentCentre);
    //    this.editService.currentMember.subscribe(message => {
    //      this.currMininstry = message;
    //      console.log(this.currMininstry);
    //  });
    
    });
      this.router.navigate(['/centerregistration/' +  Type.editcentre]);
    }
    forView(value): void {
       this.getRecordReq = {
           'REC_PK': value['CTR_PK']
       };
       this.apiService.getCentreDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
      
        this.currentCentre = data['Data'][0];
        console.log(this.currentCentre);
        this.currentCouncil['PRESIDENT_TEXT'] = this.currentCentre['CTR_PRESIDENT_TEXT'];
        this.currentCouncil['SECRETARY_TEXT'] = this.currentCentre['CTR_SECRETARY_TEXT'];
        this.currentCouncil['TREASURER_TEXT'] = this.currentCentre['CTR_TREASURER_TEXT'];
        this.currentCouncil['VICE_PRESIDENT1_TEXT'] = this.currentCentre['CTR_VICE_PRESIDENT1_TEXT'];
        this.currentCouncil['VICE_PRESIDENT2_TEXT'] = this.currentCentre['CTR_VICE_PRESIDENT2_TEXT'];
        this.currentCouncil['JOINT_SECRETARY1_TEXT'] = this.currentCentre['CTR_JOINT_SECRETARY1_TEXT'];
        this.currentCouncil['JOINT_SECRETARY2_TEXT'] = this.currentCentre['CTR_JOINT_SECRETARY2_TEXT'];
        this.currentCouncil['PRESIDENT_PHOTO'] = this.currentCentre['CTR_PRESIDENT_PHOTO'];
        this.currentCouncil['SECRETARY_PHOTO'] = this.currentCentre['CTR_SECRETARY_PHOTO'];
        this.currentCouncil['TREASURER_PHOTO'] = this.currentCentre['CTR_TREASURER_PHOTO'];
        this.currentCouncil['VICE_PRESIDENT1_PHOTO'] = this.currentCentre['CTR_VICE_PRESIDENT1_PHOTO'];
        this.currentCouncil['VICE_PRESIDENT2_PHOTO'] = this.currentCentre['CTR_VICE_PRESIDENT2_PHOTO'];
        this.currentCouncil['JOINT_SECRETARY1_PHOTO'] = this.currentCentre['CTR_JOINT_SECRETARY1_PHOTO'];
        this.currentCouncil['JOINT_SECRETARY2_PHOTO'] = this.currentCentre['CTR_JOINT_SECRETARY2_PHOTO'];
        this.commoneditService.changeCentre(this.currentCentre);
        this.commoneditService.changeCouncil(this.currentCouncil);
        this.commoneditService.currentCouncil.subscribe((datas) => {console.log(datas); });
      
    
      });
    
       this.router.navigate(['/centerregistration/' +  Type.viewCentre]);
    }
    forDelete(value): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                console.log(result);
                this.getRecordReq = {
                    'REC_PK': value['CTR_PK']
                };
                this.apiService.getCentreDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
                 this.currentCentre = data['Data'][0];
                 const deleteReq = {
                    'REC_PK': this.currentCentre['CTR_PK'],
                    'LAST_MOD_DT': this.currentCentre['LAST_MOD_DT']
                };
                this.apiService.deleteCentre(deleteReq, this.header).subscribe((res: Array<object>) => {
                    console.log(res);
                    if (res['Data'] > 0) {
                        this.DialogRef = this._matDialog.open(DialogComponent, {
                            disableClose: true
                        });
                
                        this.DialogRef.componentInstance.Message = 'Record Deleted Successfully';
                
                        this.DialogRef.afterClosed().subscribe(results => {
                            if ( results )
                            {
                                this.centrelistrequest = {
                                    'PAGE_NO': 1,
                                    'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                    'USER_PK': 1,
                                    'CTR_REGION': null,
                                    'CTR_COUNTRY': null
                                };
                                this.getCentreList();
                               
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
                            this.centrelistrequest = {
                                'PAGE_NO': 1,
                                'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                'USER_PK': 1,
                                'CTR_REGION': null,
                                'CTR_COUNTRY': null
                            };
                            this.getCentreList();
                           
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
    addCentrenav(): void {
     this.router.navigate(['/centerregistration'] );
    }
    toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}

}
