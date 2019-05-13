import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FuseConfirmDialogModule } from '@fuse/components/confirm-dialog/confirm-dialog.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { FuseHighlightModule } from '@fuse/components';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from './fuse-config';

import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { SampleModule } from './main/sample/sample.module';
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
import { DialogComponent } from './dialog/dialog.component';
import { CouncilComponent } from './council/council.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { NewsManagementComponent } from './news-management/news-management.component';
import { NewsRegistrationComponent } from './news-registration/news-registration.component';
import { CouncilDetailsComponent } from './council-details/council-details.component';
import {MemberRenewalComponent} from './member-renewal/member-renewal.component';
import { AppRoutingModule } from './app-routing.module';
import {AppMaterialModule} from './app-material.module';
import { AddMemberrenewalComponent } from './add-memberrenewal/add-memberrenewal.component';
import { RenewalComponent } from './renewal/renewal.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { PrintRgnlistComponent } from './print-rgnlist/print-rgnlist.component';
import { PrintCntrComponent } from './print-cntr/print-cntr.component';
import { PrintChurchComponent } from './print-church/print-church.component';
import { PrntMemberComponent } from './prnt-member/prnt-member.component';
import { PrntMinistryComponent } from './prnt-ministry/prnt-ministry.component';
import {MemberlistingComponent} from './memberlisting/memberlisting.component';
import {DataimportComponent} from './dataimport/dataimport.component';
import {SortComponent} from './sort/sort.component';
 import { CouncilMembersComponent } from './council-members/council-members.component';

 import {CountryComponentComponent} from './country-component/country-component.component'

import {MatSortModule,MatSort,MatFormFieldModule,MatInputModule ,MatTableModule,MatPaginatorModule,} from '@angular/material';;
@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MemberregistrationComponent,
        ChurchregistrationComponent,
        RegionregistrationComponent,
        CentreregistrationComponent,
        MembershiplistComponent,
        MinistrylistComponent,
        ChurchlistComponent,
        CentrelistComponent,
        RegionlistComponent,
        DialogComponent,
        CouncilComponent,
        UserManagementComponent,
        UserRegistrationComponent,
        NewsManagementComponent,
        NewsRegistrationComponent,
        CouncilDetailsComponent,
        MemberRenewalComponent,
        AddMemberrenewalComponent,
        RenewalComponent,
        PrintRgnlistComponent,
        PrintCntrComponent,
        PrintChurchComponent,
        PrntMemberComponent,
        PrntMinistryComponent,
        MemberlistingComponent,
        SortComponent,
        DataimportComponent,
        CouncilMembersComponent,
        CountryComponentComponent,
      
       
       
    ],
    entryComponents: [
      DialogComponent,
      AddMemberrenewalComponent
    ],
   
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule ,

        
        TranslateModule.forRoot(),

       

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        FuseConfirmDialogModule,
        // App modules
        LayoutModule,
        SampleModule,
        FuseHighlightModule,
        AppRoutingModule,
        AppMaterialModule
    ],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
    bootstrap   : [
        AppComponent
    ],
    schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule
{
}

