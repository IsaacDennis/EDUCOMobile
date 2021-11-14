import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ImageService } from 'src/app/services/local/image.service';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.page.html',
  styleUrls: ['./create-post-modal.page.scss'],
})
export class CreatePostModalPage implements OnInit {
  @Input() groupId: number;
  constructor(
    private modalController: ModalController,
    private sheetController: ActionSheetController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private image: ImageService,
    ) { }

  ngOnInit() {
  }
  async dismissModal(){
    await this.modalController.dismiss();
  }
  async presentLoading(): Promise<Element>{
    const loading = await this.loadingController.create({
      backdropDismiss: true,
      message: '0%'
    });
    await loading.present();
    return loading.querySelector('.loading-content');
  }
  async presentImageSheet(){
    const sheet = await this.sheetController.create({
      header: 'Opções',
      buttons: [
        {
          text: 'Tirar uma foto',
          handler: async () => {
            const photo = await this.image.getImageFromSource(CameraSource.Camera);
          }
        },
        {
          text: 'Selecionar da galeria',
          handler: async () => {
            const image = await this.image.getImageFromSource(CameraSource.Photos);
          }
        },
        {
          text: 'Escanear texto',
          handler: async () => {
            const image = await this.image.getImageFromSource(CameraSource.Camera);
            await sheet.dismiss();
            const loadingContent = await this.presentLoading();
            const logger = worker => {
              const percentage = Math.ceil(worker.progress * 100);
              loadingContent.textContent = `Analisando a imagem - ${percentage}%`;
            };
            const { data: { text } } = await this.image.recognizeText(image, logger);
            await this.loadingController.dismiss();
            this.presentRecognizedText(text);
          }
        }
      ],
    });
    await sheet.present();
  }
  async presentRecognizedText(text: string){
    const alert = await this.alertController.create({
      header: 'Texto detectado',
      subHeader: 'Selecione uma parte ou copie tudo. A exatidão do texto depende da qualidade da imagem.',
      message: text,
      buttons: [
        {
          text: 'Copiar tudo',
          handler: () => {

          }
        },
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }
}
