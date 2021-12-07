import { Injectable } from '@angular/core';
import Tesseract from 'tesseract.js';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  async getImageFromSource(source: CameraSource): Promise<Photo>{
    return await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      allowEditing: true,
      quality: 100,
      source,
    });
  }
  async recognizeText(photo: Photo, logger?: (worker) => void): Promise<Tesseract.RecognizeResult>{
    return Tesseract.recognize(
      photo.webPath,
      'por',
      { logger }
    );
  }
  async convertBlobToFile(photo: Photo){
    const blob = await this.http.get(photo.webPath, {
      responseType: 'blob'
    }).toPromise();
    const file = new File([blob], 'image', { type: `image/${photo.format}`});
    return file;
  }
}
