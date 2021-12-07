/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import external from 'external.config.json';
import { User } from 'src/app/models/user.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { group } from 'console';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken = '';
  loggedUser: BehaviorSubject<User> = new BehaviorSubject(null);
  baseUrl: string = external.serverUrl + '/sessions';
  constructor(private http: HttpClient, private fireStorage: AngularFireStorage) { }
  authenticateUser(email: string, password: string): void{
    this.http.post<string>(this.baseUrl, { email, password })
      .pipe(
        mergeMap(this.getUserFromToken)
      )
      .subscribe(user => this.loggedUser.next(user));
  }
  getUserFromToken = (token: string): Observable<User> => {
    this.authToken = token;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    return this.http.get(this.baseUrl, { headers })
      .pipe(
        map(response => new User(
          response['id'],
          response['name'],
          response['birth'],
          response['created_at'],
          response['updated_at'],
          response['bio'],
        )),
        mergeMap(user => this.getUserImage(user.id)
          .pipe(
            map(url => {
              user.imageUrl = url;
              return user;
            }),
            catchError(() => {
              user.imageUrl = 'assets/mock-person.png';
              return of(user);
            })
          ))
      );
  };
  getUserImage(userId: string){
    const imagePath = `users/${userId}`;
    return this.fireStorage.ref(imagePath).getDownloadURL();
  }
}
