import { Component } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-startbildschirm',
  templateUrl: './startbildschirm.page.html',
  styleUrls: ['./startbildschirm.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, RouterLink],
})
export class StartbildschirmPage {
}
