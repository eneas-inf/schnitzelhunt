import {Routes} from '@angular/router';
import {StartScreenPage} from "./pages/start-screen/start-screen-page";
import {CameraPermissionsPage} from "./pages/permissions/camera-permissions/camera-permissions-page";
import {LocationPermissionsPage} from "./pages/permissions/location-permissions/location-permissions-page";
import {ShowTaskPage} from "./pages/show-task/show-task-page";
import {TaskCompletedPage} from "./pages/task-completed/task-completed-page";
import {ResultsPage} from "./pages/results/results-page";
import {TabsPage} from "./pages/tabs/tabs.page";
import {HomePage} from "./pages/home/home.page";
import {SettingsPage} from "./pages/settings/settings.page";
import {LeaderboardPage} from "./pages/leaderboard/leaderboard.page";
import {ExplorePage} from "./pages/explore/explore.page";

export const routes: Routes = [
  {path: '', redirectTo: 'start-screen', pathMatch: 'full'},
  {path: 'start-screen', component: StartScreenPage},
  {
    path: 'permissions',
    children: [
      {path: 'camera', component: CameraPermissionsPage},
      {path: 'location', component: LocationPermissionsPage}
    ]
  },
  {path: 'show-task', component: ShowTaskPage},
  {path: 'task-completed', component: TaskCompletedPage},
  {path: 'results', component: ResultsPage},
  {
    path: '',
    component: TabsPage,
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomePage},
      {path: 'explore', component: ExplorePage},
      {path: 'leaderboard', component: LeaderboardPage},
      {path: 'settings', component: SettingsPage},
    ],
  },
];
