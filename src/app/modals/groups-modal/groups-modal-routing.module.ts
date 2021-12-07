import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupsModalPage } from './groups-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GroupsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsModalPageRoutingModule {}
