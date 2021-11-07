/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import external from 'external.config.json';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from 'src/app/models/post.model';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  baseUrl: string = external.serverUrl + '/posts';
  constructor(private http: HttpClient) { }
  createPost(postData: Post): Observable<Post>{
    return this.http.post<Post>(this.baseUrl, postData);
  }
  deletePost(postId: number): Observable<any>{
    return this.http.delete(this.baseUrl + `/${postId}`);
  }
  getPostsByGroup(groupId: number, quantity?: number, startIndex?: number): Observable<Post[]>{
    return this.http.post<any[]>(this.baseUrl + `/by_group/${groupId}`, {quantity, startIndex})
      .pipe(
        map(responses => responses.map(response => new Post(
          response['id'],
          response['userId'],
          response['groupId'],
          response['text'],
          response['created_at'],
          response['updated_at'],
          response['imageId']
        )))
      );
  }
}
