import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { MemberService } from '../services/member/member.service';
import { ApiService } from '../services/common/common.service';
import {AuthService} from '../authentication/auth.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { EditService } from '../services/member/edit.service';
import {CommonEditService} from '../services/common/edit.service';
import {CommonDataObject} from '../services/common/commonDataObject';
import {GlobalUrl} from '../utility/GlobalUrl';
import { ReplaySubject } from 'rxjs';
import { Router,ActivatedRoute } from '@angular/router';
import {Type} from '../utility/type';
import {DialogComponent} from '../dialog/dialog.component';
import {RegionModel} from '../business-object/regionbo';
@Component({
  selector: 'app-regionlist',
  templateUrl: './regionlist.component.html',
  styleUrls: ['./regionlist.component.scss', '../scss/listing.scss', '../scss/settingbutton.scss']
})
export class RegionlistComponent implements OnInit {
    displayedColumns: string[] = ['ID', 'Name', 'President', 'Mobile','RGN_EMAIL', 'Edit'];
    dataSource: MatTableDataSource<RegionModel>;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DialogRef: MatDialogRef<DialogComponent>;
    enableSearch: Boolean = false;
    pageNo = 1;
    countryID: any;
    searchForm: FormGroup;
    regionlistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'RGN_COUNTRY': null
    };
    country = ['Dubai', 'India'];
    getRecordReq = {};
    regionlist: RegionModel[]; 
    countires: Array<object>;
    currMininstry: any;
    currentRegion: any;
    disableprev: Boolean = true;
    disablenext: Boolean = true;
    makesearch: Boolean = false;
    enableAll: Boolean = false;
    currentCouncil: any = {};
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } }; 
    @ViewChild(MatSort) sort: MatSort;
    public countryFilterCtrl: FormControl = new FormControl();
    public filteredCount: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private memberService: MemberService,
    private editService: EditService,
    private authService: AuthService,
    private commoneditService: CommonEditService,
    private CommondataObject: CommonDataObject,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    private router: Router,
    private GlobalUrls: GlobalUrl,private act_route: ActivatedRoute) { 
        this.getRegions();
    }

    ngOnInit(): void {
        
        this.act_route.params.subscribe(params => {
            if(params['countryID']!=null)
                this.countryID = params['countryID'];
            else
                this.countryID=0;
            if(this.countryID>0)
            {
                this.pageNo = 1;
                this.disableprev = true;
                this.regionlistrequest = 
                {
                    'PAGE_NO':  this.pageNo,
                    'PAGE_SIZE' : this.GlobalUrls.pageSize,
                    'USER_PK': 1,
                    'RGN_COUNTRY': this.countryID
                };
                this.getRegionList(this.regionlistrequest);
            }
        });
      
        this.editService.changeMember(this.editService.member);
        this.commoneditService.changeRegion(this.CommondataObject.region);
        this.searchForm = this._formBuilder.group({
            ddlCountry: [null],
        });
        this.getCountries(0);
    
        this.countryFilterCtrl.valueChanges
        .subscribe(() => {
          this.filterCounts();
        });
     }
     getRegions(): void {
        this.apiService.getRegionList(this.regionlistrequest, this.header).subscribe((data: Array<object>) => {
            this.regionlist = data['Data'];
            console.log(this.regionlist);
            this.dataSource = new MatTableDataSource(this.regionlist);
        });
        this.regionlistrequest = {
          'PAGE_NO':  this.pageNo + 1,
          'PAGE_SIZE' : this.GlobalUrls.pageSize,
          'USER_PK': 1,
          'RGN_COUNTRY': null
      };
      this.apiService.getRegionList( this.regionlistrequest, this.header ).subscribe((data: Array<object>) => {
          if (data['Data'] === null) {
             this.disablenext = true;
          }else {
            this.disablenext = false;
          }
      });  
     }
      getRegionList(regReq): any {
        this.apiService.getRegionList(regReq, this.header).subscribe((data: Array<object>) => {
          this.regionlist = data['Data'];
          this.dataSource = new MatTableDataSource(this.regionlist);
      });
      regReq = {
        'PAGE_NO':  this.pageNo + 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        'RGN_COUNTRY': this.searchForm.value.ddlCountry
    };
    this.apiService.getRegionList( regReq, this.header ).subscribe((data: Array<object>) => {
        if (data['Data'] === null) {
           this.disablenext = true;
        }else {
            this.disablenext = false;  
        }
    });
    }


    forregiondrill(value): any {
        this.authService.countryID=this.countryID;
        this.router.navigate(['/centrelist/',this.countryID,value['RGN_PK']]);
     }
     

      getCountries(val): any {
        this.apiService.getCountry(this.header).subscribe((data: Array<object>) => {
            this.countires = data['Data'];
            this.filteredCount.next(this.countires.slice());
            // if(val>0)
            //   this.searchForm.controls.ddlCountry.setValue(val);
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
      test():any{
        this.getCountries(1);
        //this.searchForm.controls.ddlCountry.setValue(this.countryID);
      }
      nextPage(): any {
         
          this.pageNo += 1;
          this.disableprev = false; 
          this.regionlistrequest = {
              'PAGE_NO':  this.pageNo,
              'PAGE_SIZE' : this.GlobalUrls.pageSize,
              'USER_PK': 1,
              'RGN_COUNTRY':this.countryID>0 ? this.countryID: this.searchForm.value.ddlCountry
          };
          this.getRegionList(this.regionlistrequest);
      }
      previousPage(): any {
          this.pageNo -= 1;
          this.disablenext = false;
          if (this.pageNo < 2) {
            this.disableprev = true; 
          }
          this.regionlistrequest = {
              'PAGE_NO':  this.pageNo,
              'PAGE_SIZE' : this.GlobalUrls.pageSize,
              'USER_PK': 1,
              'RGN_COUNTRY': this.countryID>0 ? this.countryID: this.searchForm.value.ddlCountry
          };
          this.getRegionList(this.regionlistrequest);
      } 
      filterRegion(): void {
        this.pageNo = 1;
        this.disableprev = true;
        this.regionlistrequest = {
           'PAGE_NO':  this.pageNo,
           'PAGE_SIZE' : this.GlobalUrls.pageSize,
           'USER_PK': 1,
           'RGN_COUNTRY': this.searchForm.value.ddlCountry
        };
         this.enableSearch = false;
         this.getRegionList(this.regionlistrequest);
         this.enableAll = true;
      }
      getAllRegions(): void{
        this.countryID=0;
        this.pageNo = 1;
        this.disableprev = true;
        this.regionlistrequest = {
            'PAGE_NO': this.pageNo,
            'PAGE_SIZE' : this.GlobalUrls.pageSize,
            'USER_PK': 1,
            'RGN_COUNTRY': null,
        };
        this.getRegionList(this.regionlistrequest);
        this.searchForm.reset();
        this.enableAll = false;
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
      onCountrySelect(): void {
        this.makesearch = true; 
      }
    closeFun(): any {
        this.enableSearch = false;
        this.searchForm.reset();
    }

    forEdit(value): any {
       this.getRecordReq = {
        'REC_PK': value['RGN_PK']
       };
       this.apiService.getRegionDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
       this.currentRegion = data['Data'][0];
       this.commoneditService.changeRegion(this.currentRegion);
    
    });
      this.router.navigate(['/regionregistration/' +  Type.editregion]);
    }
    forView(value): void {
       this.getRecordReq = {
           'REC_PK': value['RGN_PK']
       };
       this.apiService.getRegionDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
        this.currentRegion = data['Data'][0];
        this.currentCouncil['PRESIDENT_TEXT'] = this.currentRegion['RGN_PRESIDENT_TEXT'];
        this.currentCouncil['SECRETARY_TEXT'] = this.currentRegion['RGN_SECRETARY_TEXT'];
        this.currentCouncil['TREASURER_TEXT'] = this.currentRegion['RGN_TREASURER_TEXT'];
        this.currentCouncil['VICE_PRESIDENT1_TEXT'] = this.currentRegion['RGN_VICE_PRESIDENT1_TEXT'];
        this.currentCouncil['VICE_PRESIDENT2_TEXT'] = this.currentRegion['RGN_VICE_PRESIDENT2_TEXT'];
        this.currentCouncil['JOINT_SECRETARY1_TEXT'] = this.currentRegion['RGN_JOINT_SECRETARY1_TEXT'];
        this.currentCouncil['JOINT_SECRETARY2_TEXT'] = this.currentRegion['RGN_JOINT_SECRETARY2_TEXT'];
        this.currentCouncil['PRESIDENT_PHOTO'] = this.currentRegion['RGN_PRESIDENT_PHOTO'];
        this.currentCouncil['SECRETARY_PHOTO'] = this.currentRegion['RGN_SECRETARY_PHOTO'];
        this.currentCouncil['TREASURER_PHOTO'] = this.currentRegion['RGN_TREASURER_PHOTO'];
        this.currentCouncil['VICE_PRESIDENT1_PHOTO'] = this.currentRegion['RGN_VICE_PRESIDENT1_PHOTO'];
        this.currentCouncil['VICE_PRESIDENT2_PHOTO'] = this.currentRegion['RGN_VICE_PRESIDENT2_PHOTO'];
        this.currentCouncil['JOINT_SECRETARY1_PHOTO'] = this.currentRegion['RGN_JOINT_SECRETARY1_PHOTO'];
        this.currentCouncil['JOINT_SECRETARY2_PHOTO'] = this.currentRegion['RGN_JOINT_SECRETARY2_PHOTO'];
        console.log(this.currentCouncil);
        this.commoneditService.changeRegion(this.currentRegion);
        this.commoneditService.changeCouncil(this.currentCouncil);
        this.commoneditService.currentCouncil.subscribe((datas) => {console.log(datas); });
       
      });
      
       this.router.navigate(['/regionregistration/' +  Type.viewRegion]);
    }
    forDelete(value): void {
        console.log(value);
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            { 
                this.getRecordReq = {
                    'REC_PK': value['RGN_PK']
                   };
                   this.apiService.getRegionDetails(this.getRecordReq, this.header).subscribe((data: Array<object>) => {
                   this.currentRegion = data['Data'][0];
                   console.log(this.currentRegion);
                   const deleteReq = {
                       'REC_PK': this.currentRegion['RGN_PK'],
                       'LAST_MOD_DT': this.currentRegion['LAST_MOD_DT']
                   };
                   this.apiService.deleteRegion(deleteReq, this.header).subscribe((res: Array<object>) => {
                       console.log(res);
                       if (res['Data'] > 0) {
                        this.DialogRef = this._matDialog.open(DialogComponent, {
                            disableClose: true
                        });
                
                        this.DialogRef.componentInstance.Message = 'Record Deleted Successfully';
                
                        this.DialogRef.afterClosed().subscribe(results => {
                            if ( results )
                            {
                                this.regionlistrequest = {
                                    'PAGE_NO': 1,
                                    'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                    'USER_PK': 1,
                                    'RGN_COUNTRY': null
                                   };
                                   this.getRegions();
                               
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
                            this.regionlistrequest = {
                                'PAGE_NO': 1,
                                'PAGE_SIZE' : this.GlobalUrls.pageSize,
                                'USER_PK': 1,
                                'RGN_COUNTRY': null
                               };
                               this.getRegions();
                           
                        }
                        this.DialogRef = null;
                  });
                }

                });
                 //  this.commoneditService.changeRegion(this.currentRegion);
                
                });
                console.log(result);
              //  this._contactsService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });
    }
    addRegionnav(): void {
     // this.router.navigate(['/regionregistration'] );
     this.router.navigate(['/regionregistration'] );
    }
    toggleSidebarOpen(key): void
    {
     this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
  


}
