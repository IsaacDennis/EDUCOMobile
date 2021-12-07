import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunitiesPageRoutingModule } from './communities-routing.module';

import { CommunitiesPage } from './communities.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { PostCardComponent } from 'src/app/components/post-card/post-card.component';
import { PostsComponent } from './routes/posts/posts.component';
import { ParticipantsComponent } from './routes/participants/participants.component';
import { SettingsComponent } from './routes/settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunitiesPageRoutingModule
  ],
  declarations: [
    CommunitiesPage,
    HeaderComponent,
    PostCardComponent,
    PostsComponent,
    ParticipantsComponent,
    SettingsComponent
  ]
})
export class CommunitiesPageModule {}
