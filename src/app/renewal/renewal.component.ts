import {Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/common/common.service';
import {AuthService} from '../authentication/auth.service';
import {MemberService} from '../services/member/member.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import { EditService } from '../services/member/edit.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Router } from '@angular/router';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Type} from '../utility/type';
@Component({
  selector: 'app-renewal',
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.scss', '../scss/listing.scss', '../scss/settingbutton.scss']
})
export class RenewalComponent implements OnInit {
    displayedColumns: string[] = ['from', 'duedate', 'remarks', 'view'];
    searchForm: FormGroup;
    dataSource: MatTableDataSource<any>;
    memberlist: Array<object> = [{}];
    pageNo = 1;
    disablenext: Boolean = true;
    disableprev: Boolean = true;
    renewlistrequest = {
        'PAGE_NO': 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        // 'MRH_PK': null,
        // 'MRH_DATE': null,
        // 'MRH_DUE_DATE_NEW': null,
        // 'MRH_REMARKS': null
    };
    currentRenewData: any;
    header = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
  constructor( private _formBuilder: FormBuilder,
               private GlobalUrls: GlobalUrl,
               private router: Router,
               private authService: AuthService,
               private editService: EditService,
               private apiService: ApiService,
               private _fuseSidebarService: FuseSidebarService,
               private memberService: MemberService ) { }

  ngOnInit(): void {
      this.getRenewList(this.renewlistrequest);
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  closeFun(): void {
      console.log('close');
  }
  register(): void {
    console.log('register');
  }
  getRenewList(req): any {
    this.memberService.getRenewPageList(req, this.header).subscribe((data: Array<object>) => {
        console.log( data['Data']);
        this.memberlist = data['Data'];
        this.dataSource = new MatTableDataSource(this.memberlist);
        console.log( this.dataSource);
    });
    this.renewlistrequest = {
        'PAGE_NO':  this.pageNo + 1,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1,
        // 'MRH_PK': null,
        // 'MRH_DATE': null,
        // 'MRH_DUE_DATE_NEW': null,
        // 'MRH_REMARKS': null
    };
    this.memberService.getRenewList(this.renewlistrequest, this.header).subscribe((data: Array<object>) => {
        if (data['Data'] === null) {
           this.disablenext = true;
        }else {
            this.disablenext = false;  
        }
    });
}
nextPage(): any {
     
    this.pageNo += 1;
    this.disableprev = false;
    this.renewlistrequest = {
        'PAGE_NO':  this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1
        // 'MRH_PK': null,
        // 'MRH_DATE': null,
        // 'MRH_DUE_DATE_NEW': null,
        // 'MRH_REMARKS': null
    };
    this.getRenewList(this.renewlistrequest);
  }
  previousPage(): any {
    this.pageNo -= 1;
    this.disablenext = false;
    if (this.pageNo < 2) {
      this.disableprev = true; 
    }
    this.renewlistrequest = {
        'PAGE_NO':  this.pageNo,
        'PAGE_SIZE' : this.GlobalUrls.pageSize,
        'USER_PK': 1
        // 'MRH_PK': null,
        // 'MRH_DATE': null,
        // 'MRH_DUE_DATE_NEW': null,
        // 'MRH_REMARKS': null
    };
    this.getRenewList(this.renewlistrequest);
} 
forView(value): void {
  const req = {
      'USER_PK': 1,
      'REC_PK': value['MRH_PK']
  };
  this.memberService.renewView(req, this.header).subscribe(data => {
      this.currentRenewData = data['Data'][0];
      console.log(this.currentRenewData);
    this.editService.changerenewViewData( this.currentRenewData);
    this.router.navigate(['/addmember/' +  Type.renewView]);
    //   this.editService.currentRenewView.subscribe( datas => {
    //     console.log(datas);

    //   });
  });
//  this.router.navigate(['/addmember/' +  Type.renewView]);
}
addMember(): void {
    this.router.navigate(['/addmember'] );
}
toggleSidebarOpen(key): void
{
    this._fuseSidebarService.getSidebar(key).toggleOpen();
}
}
