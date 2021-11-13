import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }
  async getImageFromSource(source: CameraSource){
    return await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      allowEditing: true,
      quality: 100,
    });
  }
}
