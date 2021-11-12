import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.page.html',
  styleUrls: ['./create-post-modal.page.scss'],
})
export class CreatePostModalPage implements OnInit {
  @Input() groupId: number;
  constructor(
    private modalController: ModalController,
    private sheetController: ActionSheetController
    ) { }

  ngOnInit() {
  }
  async dismissModal(){
    await this.modalController.dismiss();
  }
  async presentImageSheet(){
    const sheet = await this.sheetController.create({
      header: 'Opções',
      buttons: [
        {
          text: 'Tirar uma foto',
          handler: () => {
            console.log('1');
          }
        },
        {
          text: 'Selecionar da galeria',
          handler: () => { console.log('2'); }
        },
        {
          text: 'Escanear texto',
          handler: () => { console.log('3'); }
        }
      ],
    });
    await sheet.present();
  }
}
