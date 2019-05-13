import { Component, OnInit,ViewChild} from '@angular/core';
import {AuthService} from '../authentication/auth.service';
import { ApiService } from '../services/common/common.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import {MatSort, MatTableDataSource, MatSortModule,MatPaginator} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { MemberService } from '../services/member/member.service';
import {Type} from '../utility/type';
import { ReplaySubject } from 'rxjs';
// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }
// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];
@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})

export class SortComponent implements OnInit {
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup:FormGroup;
  isOptional = false;
  countries: Array<object> = [];
  currentMem: any;
  filteredCount:any;
  getRecordReq: any;
  currMem:any;
  members: Array<Object> = [{
    'MMM_NAME1': 'Search',
    'MMM_NAME2': 'Member',
    'MMM_NAME3': '',
    'MMM_PK': 0

 }];
  public memberFilterCtrl: FormControl = new FormControl();

public filteredMember: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  public countryFilterCtrl: FormControl = new FormControl();
  header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
  constructor(private _formBuilder: FormBuilder,private apiService: ApiService, private authService: AuthService,private memberService: MemberService,) { }

  ngOnInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    this.firstFormGroup = this._formBuilder.group({
     
      id: ['', Validators.required],
     
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      mobile: ['',[ Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]],
      // email:['', Validators.compose([
      //   Validators.required,
      //   Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      // ])]
      email: ['', Validators.email],
    });
    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ''
    });
    this.secondFormGroup = this._formBuilder.group({
      country: [''],
      region: [''],
      centre: [''],
      church: [''],
    });
    this.getCountries(this.currentMem['MMM_COUNTRY']);
    this.getMembers();
    this.memberFilterCtrl.valueChanges
    .subscribe(() => {
      this.filterMember();
    });
  }
  getMembers(): any {
    this.filteredMember.next(this.members.slice());
//     this.memberService.getMember().subscribe((data: Array<object>) => {
//         this.members = data['Data'];
        
//        this.filteredMember.next(this.members.slice());
//   });
  }
  getCountries(countryText):any{
    this.apiService.getCountry(this.header).subscribe((data:Array<Object>)=>
    {
this.countries=data['Data'];
this.filteredCount.next(this.countries.slice());

if (countryText != '') {
      
  this.secondFormGroup.controls.country.setValue(this.currentMem['MMM_COUNTRY']);
}

});
  }
  private filterCounts(): void {
  
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCount.next(this.countries.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
 
    this.filteredCount.next(
        this.countries.filter(country => country['CNT_NAME'].toLowerCase().indexOf(search) > -1)
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
         this.filteredMember.next(this.members);
     });
 
  
}

  onMemberSelect(): void {
    this.getRecordReq = {
        'REC_PK':  this.firstFormGroup.value.member
    };
    this.header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
    this.memberService.getRecordDetails(this.getRecordReq,  this.header).subscribe((data: Array<object>) => {
     this.currMem = data['Data'][0];
  
  
     this.secondFormGroup.controls.country.setValue(this.currMem['MMM_COUNTRY']);
     

 }); 
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

}
