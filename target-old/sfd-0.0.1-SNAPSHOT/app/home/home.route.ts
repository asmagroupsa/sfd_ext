import { Route } from '@angular/router';

import { HomeComponent } from './home.component';

export const HOME_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "sfd",
    pathMatch: "full"
  },
  {
    path: 'sfd',
    component: HomeComponent,
    data: { authorities: [], pageTitle: 'home.title' }
  }
];
