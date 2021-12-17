import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { AuthService } from './auth.service';
import { GroupService } from './group.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public readonly groups: BehaviorSubject<Group[]> = new BehaviorSubject([]);
  constructor(
    private group: GroupService, 
    private auth: AuthService
  ) { }
  updateGroups(): Observable<Group[]>{
    return this.auth.loggedUser.pipe(
      mergeMap(user => this.group.getGroupsByUser(user.id)),
      map(groups => {
        this.groups.next(groups);
        return groups;
      })
    );
  }
}
