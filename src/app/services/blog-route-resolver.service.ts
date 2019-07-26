import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';

import { Blogs } from '../models/blogs';
import { BlogsService } from './blogs.service';
import { Title, Meta } from '@angular/platform-browser';

@Injectable()
export class BlogRouteResolver implements Resolve<Observable<Blogs>> {

  constructor(
    private meta: Meta,
    private title: Title,
    private blogService: BlogsService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Blogs> {
    return new Observable<Blogs>(obs => {
      this.blogService.getPostBySlug(route.params['blogSlug']).subscribe(resp => {
        if (resp.status == 'ok') {
          let blog: Blogs = resp.post;
          this.title.setTitle(blog.title + " - Go4Wealth");
          this.meta.updateTag({ name: 'description', content: blog.excerpt.slice(3, -5) });
          this.meta.updateTag({ property: 'og:image', content: blog.thumbnail });
          this.meta.updateTag({ property: 'og:description', content: blog.excerpt.slice(3, -5) });
          this.meta.updateTag({ property: 'og:url', content: 'https://go4wealth.com/blogs/' + blog.slug });
          obs.next(blog);
          obs.complete();
        }
      });
    });
  }

}
