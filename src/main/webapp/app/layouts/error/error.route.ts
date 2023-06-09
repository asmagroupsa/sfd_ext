import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ErrorComponent } from './error.component';

export const errorRoute: Routes = [
  {
    path: '',
    component: ErrorComponent,
    data: {
      authorities: [],
      pageTitle: 'error.title'
    }
  },
  {
    path: 'accessdenied',
    component: ErrorComponent,
    data: {
      authorities: [],
      pageTitle: 'error.title',
      error403: true
    }
  }
];
