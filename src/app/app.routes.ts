import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'startbildschirm',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
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
  {
    path: 'startbildschirm',
    loadComponent: () => import('./pages/startbildschirm/startbildschirm.page').then( m => m.StartbildschirmPage)
  },
  {
    path: 'home',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'explore',
    redirectTo: 'tabs/explore',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    redirectTo: 'tabs/settings',
    pathMatch: 'full',
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
    redirectTo: 'tabs/leaderboard',
    pathMatch: 'full',
  },
];
