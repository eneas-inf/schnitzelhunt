import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'startbildschirm',
    pathMatch: 'full'
  },
  {
    path: 'startbildschirm',
    loadComponent: () => import('./pages/startbildschirm/startbildschirm.page').then( m => m.StartbildschirmPage)
  },
  {
    path: 'berechtigungen',
    loadComponent: () => import('./pages/berechtigungen/berechtigungen.page').then( m => m.BerechtigungenPage)
  },
  {
    path: 'aufgabe-anzeigen',
    loadComponent: () => import('./pages/aufgabe-anzeigen/aufgabe-anzeigen.page').then( m => m.AufgabeAnzeigenPage)
  },
  {
    path: 'aufgabe-abgeschlossen',
    loadComponent: () => import('./pages/aufgabe-abgeschlossen/aufgabe-abgeschlossen.page').then( m => m.AufgabeAbgeschlossenPage)
  },
  {
    path: 'ergebnisse',
    loadComponent: () => import('./pages/ergebnisse/ergebnisse.page').then( m => m.ErgebnissePage)
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./pages/leaderboard/leaderboard.page').then( m => m.LeaderboardPage)
  },
];
