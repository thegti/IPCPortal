import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
  })
export class GlobalUrl{
  
  //public  API_BASE_URL = 'http://localhost:19959/';
//  public  API_BASE_URL = 'http://202.88.227.185/IPCPortal/';
//  public  API_BASE_URL = 'http://202.88.227.185/IPCDev/';
 public MemberImgFolder = 'Upload/MemberImages/';
 public pageSize = 20;
 


}
