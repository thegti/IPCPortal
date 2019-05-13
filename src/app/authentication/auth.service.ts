import {Injectable, EventEmitter } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import {Subject} from 'rxjs/subject';
import { Observable } from 'rxjs';
// import { getMatIconFailedToSanitizeUrlError } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {GlobalUrl} from '../utility/GlobalUrl';
import { environment } from 'environments/environment';
@Injectable({
    providedIn: 'root'
  }) 
export class AuthService
{
  countryID: any;
  redirectUrl: string;
  loginStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  authChange = new Subject<boolean>();
  private user: User;
  baseUrl = environment.baseUrl;
  constructor(
    private GlobalUrls: GlobalUrl,
    private httpClient: HttpClient,  
    private router: Router){}
 registerUser(authData: AuthData): void{
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(),
      token: authData.token
    };
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
//   login(authData: AuthData): void
//   {
//     this.user = {
//       email: authData.email,
//       userId: Math.round(Math.random() * 10000).toString(),
//       token: authData.token
//     };
//     this.authChange.next(true);
//     this.router.navigateByUrl('/council/' + Type.councilView );
//   }
public login(params): Observable<any> {
  return this.httpClient.post(`${this.baseUrl}api/Account/login`, params);
  }
//   logout(): void{
//     this.user = null;
//     this.authChange.next(false);
//     this.router.navigate(['/login']);
//   }
public GetHeader(): any
{
if ( !!sessionStorage.getItem('token')) {
    return { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } };
}
else{ return {};
}

}
  public manageSession(data: User): void {
    sessionStorage.setItem('token', data['Token']);
   // sessionStorage.setItem('refresh', data.refresh_token);
    sessionStorage.setItem('user', JSON.stringify(data));
  }
  getUser(): User
  {
    return this.user;
  }

//   isAuth(): Boolean{
//     return this.user != null;
//   }
  public getUserDetail(): any {     
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user'));
    } else {
      return null;
    }
  }

  public get isLoggedIn(): Boolean { 
      return !!sessionStorage.getItem('token'); 
    }  
  public get getToken(): any{
       return sessionStorage.getItem('token'); 
    }
  public logout(): void {
    this.redirectUrl = document.location.pathname;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refresh');
    sessionStorage.removeItem('user');
    this.router.navigate(['']);
    this.loginStatus.emit(false);
  }
}
