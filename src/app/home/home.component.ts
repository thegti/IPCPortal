import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/common/common.service';
import {AuthService} from '../authentication/auth.service';
import { Router } from '@angular/router';
import {GlobalUrl} from '../utility/GlobalUrl';
import { Observable } from 'rxjs';
import {Type} from '../utility/type';
import { environment } from 'environments/environment';

declare function require(path: string): any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './homebootstrap.scss', './homeanimate.scss', './homefont.scss']
})
export class HomeComponent implements OnInit
{
 
 imgsrc = [];
 baseUrl = environment.baseUrl;
news: any= [];
council: any = [];
loginform: FormGroup;
public defaultImg: String;
  constructor(
   
      private _fuseConfigService: FuseConfigService,
      private _formBuilder: FormBuilder,
      private apiService: ApiService,
      private authService: AuthService,
      private GlobalUrls: GlobalUrl,
      private router: Router
  )
  {
      this.defaultImg="display-img.jpg";
      // Configure the layout
      this._fuseConfigService.config = {
          layout: {
              navbar   : {
                  hidden: true
              },
              toolbar  : {
                  hidden: true
              },
              footer   : {
                  hidden: true
              },
              sidepanel: {
                  hidden: true
              }
          }
      };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
    this.getNews() ; 
    this.getCouncil();
    this.loginform = this._formBuilder.group({
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  public getNews(): void{
    this.apiService.getNews().subscribe((data: Array<object>) => {
     //   this.news = data['Data'];
        for (let i = 0; i < data['Data'].length; i++) {
            if (data['Data'][i]['NWE_ACTIVE'] === 1) {
                this.news.push(data['Data'][i]);
            }
        }
  });
}
public getCouncil(): void { 
    this.apiService.getCouncil().subscribe((data: Array<object>) => {
        if(data['Data']){
          
        this.council= data['Data'];
        // this.council[0].forEach(function(key) {
        //     if(this.council[0][key] === null) {
        //         this.council[0][key] = '-';
        //     }
        // });

        //council[0][]
        console.log( this.council);
        this.imgsrc =  [ this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_PRESIDENT_PHOTO'],
                         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_SECRETARY_PHOTO'], 
                         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_TREASURER_PHOTO'],
                         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_VICE_PRESIDENT1_PHOTO'],
                         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_VICE_PRESIDENT2_PHOTO'],
                         this.baseUrl + this.GlobalUrls.MemberImgFolder + this.council[0]['CEM_JOINT_SECRETARY_PHOTO']];     
                       
                       }
    else
        {
            this.council =[{
            'CEM_PRESIDENT_TEXT': '',
            'CEM_SECRETARY_TEXT' :'',
            'CEM_TREASURER_TEXT' : '',
            'CEM_VICE_PRESIDENT1_TEXT' : '',
            'CEM_VICE_PRESIDENT2_TEXT' : '',
            'CEM_JOINT_SECRETARY_TEXT' : '',
            'CEM_PRESIDENT_TITLE':'',
            'CEM_PRESIDENT_MOBIL':'',
            'CEM_SCRETARY_TITLE':'',
            'CEM_SCRETARY_MOBIL':'',
            'CEM_TREASURER_TITLE':'',
            'CEM_TREASURER_MOBIL':'',
            'CEM_VICE_PRESIDENT1_TITLE':'',
            'CEM_VICE_PRESIDENT1_MOBIL':'',
            'CEM_VICE_PRESIDENT2_TITLE':'',
            'CEM_VICE_PRESIDENT2_MOBIL':'',
            'CEM_JOINT_SECRETARY_TITLE':'',
            'CEM_JOINT_SECRETARY_MOBIL':''


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
cleanData(o) {
    if (Object.prototype.toString.call(o) == "[object Array]") {
      for (let key = 0; key < o.length; key++) {
        this.cleanData(o[key]);
        if(Object.prototype.toString.call(o[key]) == "[object Object]") {
          if(Object.keys(o[key]).length === 0){
           o.splice(key, 1);
            key--;
          }
        }
  
      }
    }
    else if (Object.prototype.toString.call(o) == "[object Object]") {
      for (let key in o) {
        let value = this.cleanData(o[key]);
        if (value === null) {
          delete o[key];
        }
        if(Object.prototype.toString.call(o[key]) == "[object Object]") {
          if(Object.keys(o[key]).length === 0){
            delete o[key];
          }
        }
        if(Object.prototype.toString.call(o[key]) == "[object Array]") {
          if(o[key].length === 0){
            delete o[key];
          }
        }
      }
    }
    return o;
  }
onsubmit(): any {
//    if (this.loginform.value.username === 'admin' && this.loginform.value.password === 'admin123'){
//      this.router.navigateByUrl('/council/' + Type.councilView );
//    }
//  const req = {
//       'UserID': this.loginform.value.username,
//       'Password': this.loginform.value.password
//   };
//   this.apiService.login(this.loginform.value).subscribe(res => {
//       if (res['Message'] === 'Success') {
//        // this.router.navigateByUrl('/council/' + Type.councilView );
//        this.authService.login({
//         email: this.loginform.value.username,
//         password: this.loginform.value.password,
//         token: res['Data']['Token']
//       });
//     }
//       });
    this.authService.login(this.loginform.value).subscribe(res => {
        this.authService.manageSession(res['Data']);
        this.authService.loginStatus.emit(true);
            const headers = { headers: { Authorization: `Bearer ${this.authService.getToken}` } };
            this.router.navigate(['/council/' + Type.councilView, headers] );
          });
    }
}
