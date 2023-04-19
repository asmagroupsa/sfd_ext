import { Route } from '@angular/router';

import { StatsComponent } from './stats.component';
import { SfdRapatriementComponent } from './sfd-rapatriement.component';
import { SfdEtatsComponent } from './sfd-etats.component';

export const STATS_ROUTE: Route[] = [
  {
    path: '',
    component: StatsComponent,
    data: { authorities: [], pageTitle: 'Statistiques' }
  },
  {
    path: 'stats',
    component: StatsComponent,
    data: { authorities: [], pageTitle: 'Statistiques' }
  },
  {
    path: 'rapatriements',
    component: SfdRapatriementComponent,
    data: { authorities: [], pageTitle: 'Rapatriements' }
  },
  {
    path: 'etats',
    component: SfdEtatsComponent,
    data: { authorities: [], pageTitle: 'Credit accordes' }
},
];
