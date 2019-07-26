import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Blogs } from './../../../models/blogs';
import { BlogsService } from './../../../services/blogs.service';

@Component({
  selector: 'app-blogs-overview',
  templateUrl: './blogs-overview.component.html',
  styleUrls: ['./blogs-overview.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class BlogsOverviewComponent implements OnInit {

  readonly DEFAULT_BLOG_IMAGE: string = './../../../../assets/fallback-images/blogs.jpg';
  readonly BLOG_IMAGE_NOT_AVAILABLE: string = './../../../../assets/fallback-images/image-not-available.jpg';

  blogsList: Blogs[];
  base64Images: string[] = [];

  constructor(
    private blogService: BlogsService
  ) { }

  ngOnInit() {
    this.blogService.getRecentPosts().subscribe(resp => {
      if (resp.status == 'ok') {
        resp.posts.forEach((blog: Blogs) => this.base64Images.push(this.DEFAULT_BLOG_IMAGE));
        this.blogsList = resp.posts;
        this.getBase64Images();
      }
    });
  }

  getBase64Images() {
    this.blogsList.forEach((blog, index) => {
      this.blogService.getBase64Image(blog.thumbnail).subscribe(resp => {
        if (resp.data != 'err') this.base64Images[index] = resp.data;
        else this.base64Images[index] = this.BLOG_IMAGE_NOT_AVAILABLE;
      });
    })
  }

}
