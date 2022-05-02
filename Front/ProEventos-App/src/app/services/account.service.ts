import { User } from './../models/Identity/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserUpdate } from '@app/models/Identity/UserUpdate';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private currentUserSource = new ReplaySubject<User>(1);
  public  currentUser$ = this.currentUserSource.asObservable();

  baseUrl = environment.apiUrl + 'api/account/';
  constructor(private http : HttpClient) { }

  public login(model: any) : Observable<void>{
      return this.http.post<User>(this.baseUrl + 'Login' , model).pipe(
        take(1),
        map((response : User) => {
          const user = response;
          if(user){
            this.setCurrentUser(user);
          }
        })
      );
  }

  public getUser(): Observable<UserUpdate>{
    return this.http.get<UserUpdate>(this.baseUrl + 'getUser').pipe(take(1));
  }

  public updateUser(model : UserUpdate) : Observable<void>{
    return this.http.put<UserUpdate>(this.baseUrl + 'updateUser', model).pipe(
      take(1),
      map((user : UserUpdate ) => {
          this.setCurrentUser(user);
        }
      )
    );
  }

  public register(model: any) : Observable<void>{
    return this.http.post<User>(this.baseUrl + 'Register' , model).pipe(
      take(1),
      map((response : User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
}

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
    this.currentUserSource.complete();
  }

  public setCurrentUser(user: User) : void {
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  postUpload(file: any) : Observable<UserUpdate>{
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file',fileToUpload);

    return this.http
    .post<UserUpdate>(`${this.baseUrl}upload-image`,formData)
    .pipe(take(1));
  }

}
