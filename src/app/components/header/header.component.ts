import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupsModalPage } from 'src/app/modals/groups-modal/groups-modal.page';
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
  communities: Observable<Group[]>;
  currentGroup: BehaviorSubject<Group> = new BehaviorSubject(null);
  currentRouterLink: string;
  currentGroupId: number;
  constructor(
    private auth: AuthService,
    private groupService: GroupService,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.auth.loggedUser.subscribe(user => {
      if (user && this.communitiesTab){
        const communities = this.groupService.getGroupsByUser(user.id);
        this.communities = communities;
        this.currentGroup.subscribe(group => {
          if(!group) {return;}
          this.router.navigateByUrl(`/communities/posts/${group.id}`);
          this.currentGroupId = group.id;
        });
      }
    });
  }
  setCurrentGroup(groupId: string){
    const selectedGroup = this.communities
      .pipe(
        map(groups => groups.find(group => group.id === +groupId))
      );
    selectedGroup.subscribe(group => this.currentGroup.next(group));
    this.changeCommunityRoute('posts');
  }
  changeCommunityRoute(routerLink: string){
    this.currentRouterLink = routerLink;
    this.router.navigateByUrl(`/communities/${routerLink}/${this.currentGroupId}`);
  }
  async presentGroupsModal(){
    const modal = await this.modalController.create({
      component: GroupsModalPage,
      componentProps: {
        communities: this.communities
      }
    });
    await modal.present();
    const { data: { groupId, communities } } = await modal.onWillDismiss();
    this.communities = communities;
    this.setCurrentGroup(groupId);
  }
}
