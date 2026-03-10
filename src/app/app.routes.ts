import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'start-screen',
    pathMatch: 'full',
  },
  {
    path: 'start-screen',
    loadComponent: () => import('./pages/start-screen/start-screen-page').then(m => m.StartScreenPage)
  },
  {
    path: 'berechtigungen',
    children: [
      {
        path: 'camera',
        loadComponent: () => import('./pages/berechtigungen/camera-permissions/camera-permissions-page')
          .then(m => m.CameraBerechtigungenPage),
      },
      {
        path: 'location',
        loadComponent: () => import('./pages/berechtigungen/location-permissions/location-permissions-page')
          .then(m => m.LocationBerechtigungenPage),
      },
    ],
  },
  {
    path: 'show-task',
    loadComponent: () => import('./pages/show-task/show-task-page').then(m => m.ShowTaskPage),
  },
  {
    path: 'task-completed',
    loadComponent: () => import('./pages/task-completed/task-completed-page').then(m => m.TaskCompletedPage),
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results-page').then(m => m.ResultsPage),
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
