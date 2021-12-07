/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Photo } from '@capacitor/camera';
import external from 'external.config.json';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { Group } from '../../models/group.model';
@Injectable({
  providedIn: 'root'
})
export class GroupService {
  baseUrl: string = external.serverUrl + '/groups';
  participantsUrl: string = external.serverUrl + '/participants';
  constructor(private http: HttpClient, private fireStorage: AngularFireStorage) { }
  createGroup(groupData: any): Observable<any> {
    return this.http.post(this.baseUrl, groupData);
  }
  addUserToGroup(userId: string, groupId: number): Observable<any>{
    return this.http.post(this.participantsUrl, {userId, groupId});
  }
  getGroupsByUser(userId: string): Observable<Group[]>{
    return this.http.get<any[]>(this.baseUrl + `/by_userId/${userId}`)
      .pipe(
        map(responses => responses.map(response => new Group(
          response['id'],
          response['creator'],
          response['created_at'],
          response['description'],
          response['imageId'],
          response['name'],
          response['updated_at'],
          response['isPrivate'],
          response['imageUrl']
        ))),
        mergeMap(groups => {
          const groupsWithImage = groups.map(group => this.getGroupImage(group.id)
            .pipe(
              map(url => {
                group.imageUrl = url;
                return group;
              }),
              catchError(() => {
                group.imageUrl = 'assets/mock-group.jpeg';
                return of(group);
              })
            ));
          return forkJoin(groupsWithImage);
        })
      );
  }
  getGroupById(groupId: number): Observable<Group>{
    return this.http.get<any>(this.baseUrl + `/Id/${groupId}`)
      .pipe(
        map(response => new Group(
          response['id'],
          response['creator'],
          response['created_at'],
          response['description'],
          response['imageId'],
          response['name'],
          response['updated_at'],
          response['isPrivate'],
        )),
        mergeMap(group => this.getGroupImage(group.id)
          .pipe(
            map(url => {
              group.imageUrl = url;
              return group;
            }),
            catchError(() => {
              group.imageUrl = 'assets/mock-group.jpeg';
              return of(group);
            })
          )
        )
      );
  }
  getParticipants(groupId: number): Observable<User[]>{
    return this.http.get<any[]>(this.participantsUrl + `/${groupId}`)
      .pipe(
        map(responses => responses.map(response => new User(
            response['id'],
            response['name'],
            response['birth'],
            response['created_at'],
            response['updated_at'],
            response['bio'],
          ))),
          mergeMap(users => {
            const usersWithImage = users.map(user => this.getUserImage(user.id)
              .pipe(
                map(url => {
                  user.imageUrl = url;
                  return user;
                }),
                catchError(() => {
                  user.imageUrl = 'assets/mock-person.png';
                  return of(user);
                })
              ));
              return forkJoin(usersWithImage);
          })
      );
  }
  changeGroupImage(groupId: number, file: File): AngularFireUploadTask{
    console.log(file);
    return this.fireStorage.upload(`groups/${groupId}`, file);
  }
  getGroupImage(groupId: number){
    const imagePath = `groups/${groupId}`;
    return this.fireStorage.ref(imagePath).getDownloadURL();
  }
  getUserImage(userId: string){
    const imagePath = `users/${userId}`;
    return this.fireStorage.ref(imagePath).getDownloadURL();
  }
}
