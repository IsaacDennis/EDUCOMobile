import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginModalPage } from './modals/login-modal/login-modal.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private modalController: ModalController) {}
  // TODO: salvar login após fechar o aplicativo
  ngOnInit(){
    this.presentLoginModal();
  }
  async presentLoginModal(){
    const modal = await this.modalController.create({
      component: LoginModalPage
    });
    return await modal.present();
  }
}
