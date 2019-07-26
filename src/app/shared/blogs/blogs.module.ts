import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './../../material';
import { BlogsService } from './../../services/blogs.service';
import { BlogRouteResolver } from '../../services/blog-route-resolver.service';
import { BlogsRoutingComponents, BlogsRoutingModule } from './blogs-routing.module';

@NgModule({
  declarations: [BlogsRoutingComponents],
  imports: [
    CommonModule,
    MaterialModule,
    BlogsRoutingModule
  ],
  providers: [
    BlogsService,
    BlogRouteResolver
  ]
})
export class BlogsModule { }
