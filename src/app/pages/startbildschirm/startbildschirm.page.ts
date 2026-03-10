import {Component, inject} from '@angular/core';
import {IonButton, IonContent} from '@ionic/angular/standalone';
import {Router, RouterLink} from '@angular/router';
import {Dialog} from "@capacitor/dialog";
import {Userservice} from "../../userservice";

@Component({
  selector: 'app-startbildschirm',
  templateUrl: './startbildschirm.page.html',
  styleUrls: ['./startbildschirm.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, RouterLink],
})
export class StartbildschirmPage {
  private router: Router = inject(Router);
  private userService: Userservice = inject(Userservice);

  async usernameAlert() {
    const {value, cancelled} = await Dialog.prompt({
      title: 'Username',
      message: 'Please enter your username',
    });

    if (cancelled) {
      return;
    } else {
      this.userService.setUsername(value);
      await this.router.navigate(['/berechtigungen']);
    }
  }
}
