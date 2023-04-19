import { Route } from '@angular/router';

import { JhiProfileComponent } from './profile';
import { JhiProfileRessourcesComponent } from './profile-ressources';

export const profileRoute: Route = {
  path: 'profile',
  component: JhiProfileComponent,
  data: {
    pageTitle: ''
  }
};

export const profileRessourceRoute: Route = {
  path: 'profile/:profil',
  component: JhiProfileRessourcesComponent,
  data: {
    pageTitle: ''
  }
};
