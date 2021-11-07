import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunitiesPage } from './communities.page';
import { ParticipantsComponent } from './routes/participants/participants.component';
import { PostsComponent } from './routes/posts/posts.component';
import { SettingsComponent } from './routes/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: CommunitiesPage,
    children: [
      {
        path: 'posts/:groupId',
        component: PostsComponent
      },
      {
        path: 'participants/:groupId',
        component: ParticipantsComponent
      },
      {
        path: 'settings/:groupId',
        component: SettingsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunitiesPageRoutingModule {}
