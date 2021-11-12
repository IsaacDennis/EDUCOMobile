import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { Post } from 'src/app/models/post.model';
import { AuthService } from 'src/app/services/network/auth.service';
import { GroupService } from 'src/app/services/network/group.service';
import { PostService } from 'src/app/services/network/post.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  data: Observable<Map<Group, Post>>;
  constructor(
    private postService: PostService,
    private groupService: GroupService,
    private auth: AuthService
  ) {}
    ngOnInit(){
      this.auth.loggedUser.subscribe(user => {
        if (user) {
          const userGroups = this.groupService.getGroupsByUser(user.id);
          const latestPosts = userGroups.pipe(
            mergeMap(groups => {
              const requests = groups.map(group => this.postService.getPostsByGroup(group.id, 1));
              return forkJoin(requests);
            }),
            map(result => result.reduce((acc, current) => acc.concat(current), [])),
          );
          this.data = forkJoin({userGroups, latestPosts}).pipe(
            map(result => {
              const groups = result.userGroups;
              const posts = result.latestPosts;
              const dataMap = new Map();
              posts.forEach(post => {
                const postGroup = groups.find(group => group.id === post.groupId);
                dataMap.set(postGroup, post);
              });
              return dataMap;
            })
          );
        }
      });
    }
}
