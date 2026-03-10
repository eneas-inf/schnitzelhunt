import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, compass, trophy, settings } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class HomePage {
  recentActivities = [
    { name: 'Schnitzel Hunt: Migros Adventure', completed: 'Yesterday', score: 1200 },
    { name: 'Schnitzel Hunt: Subway Adventure', completed: '3 days ago', score: 1800 },
    { name: 'Schnitzel Hunt: City Explorer', completed: '2 hours ago', score: 1500 }
  ];

  constructor() {
    addIcons({ home, compass, trophy, settings });
  }
}
