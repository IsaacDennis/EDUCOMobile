import { Injectable } from '@angular/core';
import Tesseract from 'tesseract.js';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }
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
}
