import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CreatePostModalPage } from 'src/app/modals/create-post-modal/create-post-modal.page';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/network/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  posts: Observable<Post[]>;
  groupId: number;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.groupId = +params.groupId;
      this.posts = this.postService.getPostsByGroup(this.groupId);
    });
  }
  async presentCreatePostModal(){
    const modal = await this.modalController.create({
      component: CreatePostModalPage,
      componentProps: { groupId: this.groupId }
    });
    return await modal.present();
  }

}
