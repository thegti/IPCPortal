import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberregistrationComponent } from './memberregistration/memberregistration.component';
import { ChurchregistrationComponent } from './churchregistration/churchregistration.component';
import { RegionregistrationComponent } from './regionregistration/regionregistration.component';
import { CentreregistrationComponent } from './centreregistration/centreregistration.component';
import { MembershiplistComponent } from './membershiplist/membershiplist.component';
import { MinistrylistComponent } from './ministrylist/ministrylist.component';
import { ChurchlistComponent } from './churchlist/churchlist.component';
import { CentrelistComponent } from './centrelist/centrelist.component';
import { RegionlistComponent } from './regionlist/regionlist.component';
import { CouncilComponent } from './council/council.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { NewsManagementComponent } from './news-management/news-management.component';
import { NewsRegistrationComponent } from './news-registration/news-registration.component';
import {MemberRenewalComponent} from './member-renewal/member-renewal.component';
import { RenewalComponent } from './renewal/renewal.component';
import { PrintRgnlistComponent } from './print-rgnlist/print-rgnlist.component';
import { PrintCntrComponent } from './print-cntr/print-cntr.component';
import { PrintChurchComponent } from './print-church/print-church.component';
import { PrntMemberComponent } from './prnt-member/prnt-member.component';
import { PrntMinistryComponent } from './prnt-ministry/prnt-ministry.component';
import {AuthGuard} from './authentication/auth.guard';
import {MemberlistingComponent} from './memberlisting/memberlisting.component';
import {SortComponent} from './sort/sort.component';
import {DataimportComponent} from './dataimport/dataimport.component';
import {CouncilMembersComponent} from './council-members/council-members.component';
import { CanActivate } from '../../node_modules/@angular/router/src/utils/preactivation';
import {CountryComponentComponent} from './country-component/country-component.component'
const appRoutes: Routes = [
    {
     path: '',
     component: HomeComponent
    },
    {
        path: 'council/:id',
        component: CouncilComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'registration/:id',
        component: MemberregistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'churchregistration',
        component: ChurchregistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'regionregistration',
        component: RegionregistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'centerregistration',
        component: CentreregistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'memberlist',
        component: MembershiplistComponent,
        canActivate: [AuthGuard]
    },  
    {
        path: 'memberlist/:countryID/:regionID/:centreID/:churchID',
        component: MembershiplistComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'membercouncillist',
        component: CouncilMembersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'countrylist',
        component: CountryComponentComponent,
        canActivate: [AuthGuard]
    },
    {
    path: 'sort',
    component: SortComponent,
    canActivate: [AuthGuard]
},
    {
        path: 'ministrylist',
        component: MinistrylistComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'dataimport',
        component: DataimportComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'churchlist',
        component: ChurchlistComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'churchlist/:countryID/:regionID/:centreID',
        component: ChurchlistComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'centrelist',
        component: CentrelistComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'centrelist/:countryID/:regionID',
        component: CentrelistComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'regionlist/:countryID',
        component: RegionlistComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'regionlist',
        component: RegionlistComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'churchregistration/:id',
        component: ChurchregistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'regionregistration/:id',
        component: RegionregistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'centerregistration/:id',
        component: CentreregistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'userregistration',
        component: UserRegistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'userlist',
        component: UserManagementComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'userregistration/:id',
        component: UserRegistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'newslist',
        component: NewsManagementComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'newsregistration',
        component: NewsRegistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'newsregistration/:id',
        component: NewsRegistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'memberrenewal',
        component: RenewalComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'addmember/:id',
        component: MemberRenewalComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'addmember',
        component: MemberRenewalComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'regionlist_rep',
        component: PrintRgnlistComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'centrelist_rep',
        component: PrintCntrComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'churchlist_rep',
        component: PrintChurchComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'memeberlist_rep',
        component: PrntMemberComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'ministrylist_rep',
        component: PrntMinistryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'list',
        component: MemberlistingComponent,
        canActivate: [AuthGuard]
    }
   
];

@NgModule({

  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
