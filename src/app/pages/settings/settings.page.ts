import { Component, OnInit } from '@angular/core';
import { CameraSource } from '@capacitor/camera';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { ImageService } from 'src/app/services/local/image.service';
import { AuthService } from 'src/app/services/network/auth.service';
import { UserService } from 'src/app/services/network/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user: Observable<User>;
  constructor(private auth: AuthService, private image: ImageService, private userService: UserService) { }

  ngOnInit() {
    this.user = this.auth.loggedUser;
    this.user.subscribe(console.log);
  }
  async changeUserAvatar(){
    const image = await this.image.getImageFromSource(CameraSource.Prompt);
    const file = await this.image.convertBlobToFile(image);
    this.user
      .pipe(
        map(user => this.userService.changeUserImage(user.id, file)),
      ).subscribe(console.log);
  }
}
