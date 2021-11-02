import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage implements OnInit {
  studyTexts = ['Matemática', 'Química', 'Física', 'Programação', 'o que quiser'];
  currentIndex = 0;
  constructor() { }

  ngOnInit() {
    setInterval(() => {
      const length = this.studyTexts.length;
      if (this.currentIndex === length - 1){
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
    }, 3000);
  }

}
