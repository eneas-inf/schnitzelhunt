import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'startbildschirm',
    pathMatch: 'full',
  },
  {
    path: 'startbildschirm',
    loadComponent: () => import('./pages/startbildschirm/startbildschirm.page').then( m => m.StartbildschirmPage)
  },
  {
    path: 'berechtigungen',
    children: [
      {
        path: 'camera',
        loadComponent: () => import('./pages/berechtigungen/camera-berechtigungen/camera-berechtigungen-page.component')
          .then(m => m.CameraBerechtigungenPage),
      },
      {
        path: 'location',
        loadComponent: () => import('./pages/berechtigungen/location-berechtigungen/location-berechtigungen-page.component')
          .then(m => m.LocationBerechtigungenPage),
      },
    ],
  },
  {
    path: 'aufgabe-anzeigen',
    loadComponent: () => import('./pages/aufgabe-anzeigen/aufgabe-anzeigen.page').then(m => m.AufgabeAnzeigenPage),
  },
  {
    path: 'aufgabe-abgeschlossen',
    loadComponent: () => import('./pages/aufgabe-abgeschlossen/aufgabe-abgeschlossen.page').then(m => m.AufgabeAbgeschlossenPage),
  },
  {
    path: 'ergebnisse',
    loadComponent: () => import('./pages/ergebnisse/ergebnisse.page').then(m => m.ErgebnissePage),
  },
  {
    path: '',
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'explore',
        loadComponent: () => import('./pages/explore/explore.page').then((m) => m.ExplorePage),
      },
      {
        path: 'leaderboard',
        loadComponent: () => import('./pages/leaderboard/leaderboard.page').then((m) => m.LeaderboardPage),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage),
      },
    ],
  },
];
