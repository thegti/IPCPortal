import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {GlobalUrl} from '../../utility/GlobalUrl';
import {ChurchModel} from '../../business-object/churchbo';
import {CountryModel} from '../../business-object/countrybo';
import {RegionModel} from '../../business-object/regionbo';
import {CentreModel} from '../../business-object/centrebo';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
//    API_URL = 'http://202.88.227.185/IPCPortal/api/';
//    test: any = '';
  // API_URL = GlobalUrl['API_BASE_URL'];
// API_URL = GlobalUrl['API_BASE_URL'];
  constructor(
      private httpClient: HttpClient,
      private GlobalUrls: GlobalUrl) { }
      baseUrl = environment.baseUrl;

   
      
  login(req): any {
    return this.httpClient.post(`${this.baseUrl}api/Account/login`, req);
  }
//   getNews(): any{
//     // return this.httpClient.get(`${this.API_URL}common/news`);
//     return this.httpClient.get(`${this.baseUrl}api/common/news`);
//     }
    getNews(): any{
        let url = this.baseUrl ;
        // return this.httpClient.get(`${this.API_URL}common/news`);
        return this.httpClient.get(`${this.baseUrl}api/Public/News`);
        }
    postNews(req, header): any{
        return this.httpClient.post(`${this.baseUrl}api/common/SaveEventNews`, req, header);
    }
    getEventNewsList(req, header): any{
        return this.httpClient.post(`${this.baseUrl}api/common/EventNewsList`, req, header);
    }
    getNewsDetails(req, header): any{
        return this.httpClient.post(`${this.baseUrl}api/common/GetEventNews`, req, header);
        
    }
    deleteNews(req, header): any {
        return this.httpClient.post(`${this.baseUrl}api/common/DeleteEventNews`, req, header);
    }
    getCouncil(): any{
        return this.httpClient.get(`${this.baseUrl}api/Public/council`);
    }
    getCountry(header): any{
        return this.httpClient.get(`${this.baseUrl}api/common/Country`, header);
    }
    getConfigValues(reqbody, header): any{
        return this.httpClient.post(`${this.baseUrl}api/common/ConfigGet`, reqbody, header);
    }
    // getConfigValues( header): any{
    //     return this.httpClient.get(`${this.baseUrl}api/common/CofigGet`, header);
    // }
    getRegion(reqbody, header): any {
        
        return this.httpClient.post(`${this.baseUrl}api/common/Region`, reqbody, header);
    }
    getCentre(reqbody, header): any {
      
        return this.httpClient.post(`${this.baseUrl}api/common/Center`, reqbody, header);
    }
    getChurch(reqbody, header): any {
        return this.httpClient.post(`${this.baseUrl}api/common/Church`, reqbody, header);
    }
   registerChurch(reqbody, header): any {
       return  this.httpClient.post(`${this.baseUrl}api/common/SaveChurch`, reqbody, header);
   }
   registerCentre(reqbody, header): any {
       return this.httpClient.post(`${this.baseUrl}api/common/SaveCentre`, reqbody, header);
   }
   registerRegion(reqbody, header): any {
    return this.httpClient.post(`${this.baseUrl}api/common/SaveRegion`, reqbody, header); 
   }
   getChurchList(req, header): any {
    return this.httpClient.post<ChurchModel>(`${this.baseUrl}api/common/GetChurchPageList`, req, header); 
   }

   getCountryList( header): any {
    return this.httpClient.get<CountryModel>(`${this.baseUrl}api/common/Country`, header); 
   }
   getChurchDetails(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/common/GetChurch`, req, header); 
   }
   getRegionList(req, header): any {
    return this.httpClient.post<RegionModel>(`${this.baseUrl}api/common/GetRegionPageList`, req, header); 
   }
   getRegionDetails(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/common/GetRegion`, req, header);
   }
   getCentreList(req, header): any {
    return this.httpClient.post<CentreModel>(`${this.baseUrl}api/common/GetCentrePageList`, req, header);
   }
   getCentreDetails(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/common/GetCentre`, req, header);
   }
   deleteRegion(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/common/DeleteRegion`, req, header);
   }
   deleteChurch(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/common/DeleteChurch`, req, header);
   }
   deleteCentre(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/common/DeleteCentre`, req, header);  
   }
   saveCouncil(req, header): any {
       return this.httpClient.post(`${this.baseUrl}api/common/SaveCouncil`, req, header);
   }
   getDecrypt(req, header): any{
    return this.httpClient.post(`${this.baseUrl}api/common/Decript`, req, header);
   }


  
}
