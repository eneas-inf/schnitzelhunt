import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('../home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('../explore/explore.page').then((m) => m.ExplorePage),
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('../leaderboard/leaderboard.page').then((m) => m.LeaderboardPage),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
