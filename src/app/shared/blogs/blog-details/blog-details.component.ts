import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Blogs } from './../../../models/blogs';
import { BlogsService } from './../../../services/blogs.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogDetailsComponent implements OnInit {

  readonly DEFAULT_BLOG_IMAGE: string = './../../../../assets/fallback-images/blogs.jpg';
  readonly BLOG_IMAGE_NOT_AVAILABLE: string = './../../../../assets/fallback-images/image-not-available.jpg';

  blog: Blogs;
  blogImage: string = this.DEFAULT_BLOG_IMAGE;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private blogService: BlogsService
  ) { }

  ngOnInit() {
    this.blog = this.route.snapshot.data['article'];
    this.blogService.getBase64Image(this.blog.thumbnail).subscribe(resp => {
      if (resp.data != 'err') this.blogImage = resp.data;
      else this.blogImage = this.BLOG_IMAGE_NOT_AVAILABLE;
    });

    // console.log(this.route.snapshot.data['article']);
    // this.route.params.subscribe(params => {
    //   if (params['blogSlug'] && params['blogSlug'] != '')
    //     this.blogService.getPostBySlug(params['blogSlug']).subscribe(resp => {
    //       this.blog = resp.post;
    //       this.blogService.getBase64Image(this.blog.thumbnail).subscribe(resp => {
    //         if (resp.data != 'err') this.blogImage = resp.data;
    //         else this.blogImage = this.BLOG_IMAGE_NOT_AVAILABLE;
    //       });
    //     });
    //   else this.router.navigate(['/blogs']);
    // });
  }

}
