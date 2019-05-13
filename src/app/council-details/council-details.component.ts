import { Component, OnInit } from '@angular/core';
import {  CommonEditService } from '../services/common/edit.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {GlobalUrl} from '../utility/GlobalUrl';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-council-details',
  templateUrl: './council-details.component.html',
  styleUrls: ['./council-details.component.scss',
               '../council/council.component.scss', 
               '../scss/council.scss',
               '../home/homebootstrap.scss',
               '../home/homeanimate.scss',
               '../home/homefont.scss',
               '../scss/settingbutton.scss']
})
export class CouncilDetailsComponent implements OnInit {
  baseUrl = environment.baseUrl;
  council = {};
  imgsrc = [];
  public defaultImg: String;
  constructor(private _fuseSidebarService: FuseSidebarService,
              private CommoneditService: CommonEditService,
              private GlobalUrls: GlobalUrl ) {
                this.defaultImg="display-img.jpg";
               }

  ngOnInit(): void {
      this.CommoneditService.currentCouncil.subscribe((data) => {
        if(data)
        {

  
         this.council = data;
         console.log(this.council);
         this.imgsrc =  [ this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council['PRESIDENT_PHOTO'],
         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council['SECRETARY_PHOTO'], 
         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council['TREASURER_PHOTO'],
         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council['VICE_PRESIDENT1_PHOTO'],
         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council['VICE_PRESIDENT2_PHOTO'],
         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council['JOINT_SECRETARY1_PHOTO'],
         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council['JOINT_SECRETARY2_PHOTO']];     
        }
         else
         {
             this.council =[{
              'PRESIDENT_TEXT':'',
              'SECRETARY_TEXT':'',
              'TREASURER_TEXT':'',
              'VICE_PRESIDENT2_TEXT':'',
              'VICE_PRESIDENT1_TEXT':'',
               'JOINT_SECRETARY1_TEXT':'',
               'JOINT_SECRETARY2_TEXT':''
               
     
     
               }];
               this.imgsrc =  [ this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg,
                this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg, 
                this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg,
                this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg,
                this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg,
                this.baseUrl + this.GlobalUrls.MemberImgFolder + this.defaultImg];     
         }
     
     
        });
  }
  toggleSidebarOpen(key): void
  {
      this._fuseSidebarService.getSidebar(key).toggleOpen();
  }

}
