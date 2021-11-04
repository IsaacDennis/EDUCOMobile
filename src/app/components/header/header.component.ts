import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { AuthService } from 'src/app/services/network/auth.service';
import { GroupService } from 'src/app/services/network/group.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() searchName: string;
  @Input() communitiesTab: boolean;
  @Output() groupChange: EventEmitter<Group> = new EventEmitter();
  communities: Group[] = [];
  currentGroup: Group;
  constructor(
    private auth: AuthService,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.auth.loggedUser.subscribe(user => {
      if (user && this.communitiesTab){
        this.groupService
          .getGroupsByUser(user.id)
          .subscribe(communities => {
            this.communities = communities;
            this.currentGroup = communities[0];
          });
      }
    });
  }
  setCurrentGroup(groupId: string){
    const selectedGroup = this.communities.find(group => group.id === +groupId);
    this.currentGroup = selectedGroup;
    this.groupChange.emit(selectedGroup);
  }

}
