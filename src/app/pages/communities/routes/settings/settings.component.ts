import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { Observable } from 'rxjs';
import { finalize, first, map, mergeMap, repeat } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { ImageService } from 'src/app/services/local/image.service';
import { GroupService } from 'src/app/services/network/group.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  group: Observable<Group>;
  constructor(
    private route: ActivatedRoute,
    private image: ImageService,
    private groupService: GroupService
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.group = this.groupService.getGroupById(+params.groupId);
    });
  }
  async changeGroupAvatar(){
    const image = await this.image.getImageFromSource(CameraSource.Photos);
    const file = await this.image.convertBlobToFile(image);
    this.group
      .pipe(
        map(
          group => this.groupService.changeGroupImage(group.id, file)
        ),
        first(),
        finalize(() => this.group = this.group.pipe(repeat(1)))
      ).subscribe(console.log);
  }
}
