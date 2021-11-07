import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/network/auth.service';
import { RegisterComponent } from './components/register/register.component';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage implements OnInit {
  studyTexts = ['Matemática', 'Química', 'Física', 'Programação', 'o que quiser'];
  currentIndex = 0;
  email: string;
  password: string;
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    setInterval(() => {
      const length = this.studyTexts.length;
      if (this.currentIndex === length - 1){
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
    }, 3000);
    this.auth.loggedUser.subscribe(user => {
      if (user){
        this.loadingController
          .dismiss()
          .then(() => this.modalController.dismiss());
      }
    });
  }
  setEmail(value: string){
    this.email = value;
  }
  setPassword(value: string){
    this.password = value;
  }
  async startAuthentication(){
    if (!this.email || !this.password){
      this.presentWarning('Preencha todos os campos.');
      return;
    }
    await this.presentLoading();
    this.auth.authenticateUser(this.email, this.password);
  }
  async presentRegister(){
    const modal = await this.modalController.create({
      component: RegisterComponent
    });
    return await modal.present();
  }
  async presentWarning(message: string){
    const warning = await this.toastController.create({
      message,
      color: 'danger',
      duration: 1000
    });
    await warning.present();
  }
  async presentLoading(){
    const loading = await this.loadingController.create({
      message: 'Autenticando o usuário'
    });
    await loading.present();
  }
}
