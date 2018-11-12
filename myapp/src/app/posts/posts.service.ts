import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private ROOT_URL = 'http://localhost:3000/api/';
  private postUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{message: string, posts: any}>(this.ROOT_URL + 'posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
            title : post.title,
            content : post.content,
            id : post._id
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postUpdated.next([...this.posts]);
    });

  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http.put(this.ROOT_URL + 'posts/' + id, post)
    .subscribe((resposne) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
     });
  }

  getPost(id: string) {
    // return {...this.posts.find(post => post.id === id)};
    return this.http.get<{_id: string, title: string, content: string}>(this.ROOT_URL + 'posts/' + id);
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{ message: string, postId: string }>(this.ROOT_URL + 'posts', post).subscribe((responseData) =>  {
      const id = responseData.postId;
      post.id  = id;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    this.http.delete(this.ROOT_URL + 'posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }
}
