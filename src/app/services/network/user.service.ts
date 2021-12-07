/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import external from 'external.config.json';
import { Observable, of } from 'rxjs';
import { catchError, map , mergeMap} from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = external.serverUrl + '/users';
  constructor(private http: HttpClient, private fireStorage: AngularFireStorage) { }
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
  }
  registerUser(userData: User){
    return this.http.post<string>(this.baseUrl, { ...userData });
  }
  changeUserImage(userId: string, file: File): AngularFireUploadTask{
    return this.fireStorage.upload(`users/${userId}`, file);
  }
  getUserImage(userId: string){
    const imagePath = `users/${userId}`;
    return this.fireStorage.ref(imagePath).getDownloadURL();
  }
}
