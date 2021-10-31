/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import external from 'external.config.json';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = external.serverUrl + '/users';
  constructor(private http: HttpClient) { }
  getUserById(userId: string): Observable<User>{
    return this.http.get(this.baseUrl + `/by_id/${userId}`)
      .pipe(
        map(response => new User(
          response['id'],
          response['name'],
          response['birth'],
          response['created_at'],
          response['updated_at'],
          response['bio'],
          response['avatar']
        ))
      );
  }
  registerUser(userData: User){
    return this.http.post<string>(this.baseUrl, { ...userData });
  }
}
