import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunitiesPageRoutingModule } from './communities-routing.module';

import { CommunitiesPage } from './communities.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunitiesPageRoutingModule
  ],
  declarations: [CommunitiesPage]
})
export class CommunitiesPageModule {}
