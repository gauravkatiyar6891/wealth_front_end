import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteTitleService } from './../../services/route-title.service';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { BlogsOverviewComponent } from './blogs-overview/blogs-overview.component';
import { BlogRouteResolver } from '../../services/blog-route-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'recents',
    pathMatch: 'full'
  },
  {
    path: 'recents',
    component: BlogsOverviewComponent,
    canActivate: [RouteTitleService],
    data: { title: 'Latest Blogs' }
  },
  {
    path: ':blogSlug',
    component: BlogDetailsComponent,
    resolve: { article: BlogRouteResolver }
  },
  {
    path: '**',
    redirectTo: 'recents'
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }

export const BlogsRoutingComponents = [
  BlogsOverviewComponent,
  BlogDetailsComponent
]
