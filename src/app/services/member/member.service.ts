import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler } from '@angular/common/http';
import {GlobalUrl} from '../../utility/GlobalUrl';
import {TokenizedInterceptor} from '../../authentication/token-int';
import {AuthService} from '../../authentication/auth.service';
import {MemberModel, GeneralCouncilModel} from '../../business-object/memberbo';
import {FilterFields} from '../../business-object/memberbo';
import {map, catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

constructor(
        private tokenInterceptor: TokenizedInterceptor,
        private httpClient: HttpClient,
        private authService: AuthService,
        private GlobalUrls: GlobalUrl) { }
        baseUrl = environment.baseUrl;
 getMember(): any {
    return this.httpClient.get(`${this.baseUrl}api/Member/GetMemberList`);
 }    
 getMemberAuto(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/Member/GetMemberAuto`, req, header);
 }   
 registerMember(reqbody): any {
            return this.httpClient.post(`${this.baseUrl}api/Member/SaveMember`, reqbody, this.authService.GetHeader());
 }
 registerMemberImage(reqbody, header): any {
    return this.httpClient.post(`${this.baseUrl}api/Utility/PostUserImage`, reqbody, header);
 }
memberFileInsert(reqbody, header): any {
   return this.httpClient.post(`${this.baseUrl}api/Utility/MemberInsert`, reqbody, header);
}
 registerMinistry(reqbody,  header): any {
            return this.httpClient.post(`${this.baseUrl}api/Member/SaveMinistry`, reqbody, header);
 }
 getMemberpageList(reqbody, header): any {
    return this.httpClient.post<MemberModel>(`${this.baseUrl}api/Member/GetMemberPageList`, reqbody, header);
 }
//  getMemberpageListNew(reqbody, header): any {
//    return this.httpClient.post<MemberModel>(`${this.baseUrl}api/Member/GetMemberPageList`, reqbody, header);
// }
 getMinistryList(reqbody, header): any {
    return this.httpClient.post<MemberModel>(`${this.baseUrl}api/Member/GetMinistryPageList`, reqbody, header);
}

getFilterFields(reqbody, header): any {
   return this.httpClient.post<FilterFields>(`${this.baseUrl}api/Common/FilterFields`, reqbody, header);
}

 getRecordDetails(reqbody, header): any {
    return this.httpClient.post(`${this.baseUrl}api/Member/GetMemberMinistry`, reqbody, header);
 }
 deleteMemberMinistry(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/Member/DeleteMemberMinistry`, req, header);
   }
   saveUser(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/Member/SaveUser`, req, header); 
   }
   getUserList(req, header): any{
    return this.httpClient.post(`${this.baseUrl}api/Member/GetUserPageList`, req, header);
   }
   getUser(req, header): any{
    return this.httpClient.post(`${this.baseUrl}api/Member/GetUser`, req, header);
   }
   deleteUser(req, header): any{
    return this.httpClient.post(`${this.baseUrl}api/Member/DeleteUser`, req, header);
   }
   getRenewList(req, header): any{
    return this.httpClient.post(`${this.baseUrl}api/Member/GetMemberRenewList`, req, header);  
   }
   registerRenewal(req, header): any{
    return this.httpClient.post(`${this.baseUrl}api/Member/SaveMemberRenew`, req, header); 
   }
   getRenewPageList(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/Member/GetMemberRenewPageList`, req, header); 
   }
   renewView(req, header): any {
    return this.httpClient.post(`${this.baseUrl}api/Member/GetMemberRenew`, req, header); 
   }

   
   getGeneralCouncil(req,header): any{
      return this.httpClient.post<GeneralCouncilModel>(`${this.baseUrl}api/Member/GetGeneralCouncil`, req,header);
  }
}
