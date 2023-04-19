import { Route } from '@angular/router';

import { AuditsComponent } from './audits.component';
import { AgencesStatistiquesComponent} from './agences-statistiques.component'
import { DashboardComponent } from './dasboard.component';

export const AUDITS_ROUTE: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    data: { authorities: [], pageTitle: 'home.audits' }
  },
  {
    path: 'audits',
    component: DashboardComponent,
    data: { authorities: [], pageTitle: 'home.title' }
  },

  {
    path: 'agence/:id/:name',
    component: AgencesStatistiquesComponent,
    data: { authorities: [], pageTitle: 'home.title' }
  }
];
