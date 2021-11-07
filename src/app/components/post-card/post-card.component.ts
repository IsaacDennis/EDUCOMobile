import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/network/user.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
  @Input() post: Post;
  author: Observable<User>;
  loading = true;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.author = this.userService.getUserById(this.post.userId)
      .pipe(
        finalize(() => this.loading = false)
      );
  }

}
