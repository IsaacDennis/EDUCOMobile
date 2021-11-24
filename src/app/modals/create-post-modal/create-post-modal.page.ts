/* eslint-disable id-blacklist */
import { Component, Input, OnInit } from '@angular/core';
import { CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ImageService } from 'src/app/services/local/image.service';
import { Clipboard } from '@capacitor/clipboard';
import { PostService } from 'src/app/services/network/post.service';
import { AuthService } from 'src/app/services/network/auth.service';
import { mergeMap } from 'rxjs/operators';
@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.page.html',
  styleUrls: ['./create-post-modal.page.scss'],
})
export class CreatePostModalPage implements OnInit {
  @Input() groupId: number;
  postSubmitted = false;
  text: string;
  constructor(
    private modalController: ModalController,
    private sheetController: ActionSheetController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private postService: PostService,
    private image: ImageService,
    private auth: AuthService
    ) { }

  ngOnInit() {
  }
  async submitPost(){
    const text = this.text?.trim();
    if (!text){
      this.presentToast('Insira o conteúdo do post.', 'danger');
      return;
    }
    await this.presentLoading('Enviando o post');
    const nextFunction = () => {
      this.postSubmitted = true;
      this.presentToast('O post foi enviado.', 'success');
      this.loadingController.dismiss();
    };
    const errorFunction = () => {
      this.presentToast('Houve um erro ao enviar o post.', 'danger');
      this.loadingController.dismiss();
    };
    this.auth.loggedUser
      .pipe(
        mergeMap(user => this.postService.createPost({
          userId: user.id,
          text,
          groupId: this.groupId
        })),
      ).subscribe(nextFunction, errorFunction);
  }
  async dismissModal(){
    await this.modalController.dismiss({
      postSubmitted: this.postSubmitted
    });
  }
  async presentToast(message: string, color: string){
    const warning = await this.toastController.create({
      message,
      color,
      duration: 1000
    });
    await warning.present();
  }
  async presentLoading(message: string): Promise<Element>{
    const loading = await this.loadingController.create({
      backdropDismiss: true,
      message
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
            const loadingContent = await this.presentLoading('0%');
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
            this.writeToClipboard(text);
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
  async writeToClipboard(text: string){
    await Clipboard.write({
      string: text,
    });
  }
}
