import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { mergeMap, repeat } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { AuthService } from 'src/app/services/network/auth.service';
import { GroupService } from 'src/app/services/network/group.service';
@Component({
  selector: 'app-groups-modal',
  templateUrl: './groups-modal.page.html',
  styleUrls: ['./groups-modal.page.scss'],
})
export class GroupsModalPage implements OnInit {
  @Input() communities: Observable<Group[]>;
  constructor(
    private modalController: ModalController,
    private actionController: ActionSheetController,
    private alertController: AlertController,
    private groupService: GroupService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    console.log(this.communities);
  }
  async dismissModal(groupId: string){
    await this.modalController.dismiss({
      groupId,
      communities: this.communities
    });
  }
  async presentGroupActionSheet(){
    const actionSheet = await this.actionController.create({
      buttons: [
        {
          text: 'Pesquisar novos grupos',
          icon: 'search'
        },
        {
          text: 'Criar grupo',
          icon: 'add',
          handler: () => this.presentCreateGroupPrompt()
        }
      ]
    });
    await actionSheet.present();
  }
  async presentCreateGroupPrompt(){
    const alertPrompt = await this.alertController.create({
      header: 'Crie uma comunidade',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nome do grupo'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descrição do grupo'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: result => {
            const { name, description } = result;
            this.auth.loggedUser
              .pipe(
                mergeMap(user => this.groupService.createGroup({
                  creator: user.id,
                  name,
                  description,
                  isPrivate: false
                }))
              ).subscribe(v => {
                console.log(v);
                this.communities = this.communities.pipe(repeat(1));
              });
          }
        }
      ]
    });
    await alertPrompt.present();
  }
}
