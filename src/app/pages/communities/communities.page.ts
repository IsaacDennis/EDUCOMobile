import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/models/group.model';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.page.html',
  styleUrls: ['./communities.page.scss'],
})
export class CommunitiesPage implements OnInit {
  currentGroup: Group;
  constructor() { }

  ngOnInit() {
  }
  onGroupChange(group: Group){
    console.log(group);
  }
}
