import { Injectable } from '@angular/core';
import { HttpHelperService } from './http-helper.service';
import { ApiRoutingService } from './api-routing.service';

@Injectable()
export class BlogsService {

  constructor(
    private http: HttpHelperService, private apiRoutingService: ApiRoutingService) { }

  getRecentPosts() {
    return this.http.get(this.apiRoutingService.getRecentPostsUrl(), null, false);
  }

  getPostById(postId: number) {
    return this.http.get(this.apiRoutingService.getPostByIdUrl(postId), null, false);
  }

  getPostBySlug(slug: string) {
    return this.http.get(this.apiRoutingService.getPostBySlugUrl(slug), null, false);
  }

  getBase64Image(imageUrl: string) {
    return this.http.postWithoutErrorCatch(this.apiRoutingService.getBase64ImageUrl(), { imageUrl: imageUrl }, null, false);
  }

}
