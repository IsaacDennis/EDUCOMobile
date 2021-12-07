import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupsModalPageRoutingModule } from './groups-modal-routing.module';

import { GroupsModalPage } from './groups-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupsModalPageRoutingModule
  ],
  declarations: [GroupsModalPage]
})
export class GroupsModalPageModule {}
