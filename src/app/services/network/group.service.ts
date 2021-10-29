/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import external from 'external.config.json';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { Group } from '../../models/group.model';
@Injectable({
  providedIn: 'root'
})
export class GroupService {
  baseUrl: string = external.serverUrl + '/groups';
  participantsUrl: string = external.serverUrl + '/participants';
  constructor(private http: HttpClient) { }
  createGroup(groupData: any): Observable<any> {
    return this.http.post(this.baseUrl, groupData);
  }
  addUserToGroup(userId: string, groupId: number): Observable<any>{
    return this.http.post(this.participantsUrl, {userId, groupId});
  }
  getGroupsByUser(userId: string): Observable<Group[]>{
    return this.http.get<Group[]>(this.baseUrl + `/${userId}`);
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
            response['avatar']
          )))
      );
  }
}
