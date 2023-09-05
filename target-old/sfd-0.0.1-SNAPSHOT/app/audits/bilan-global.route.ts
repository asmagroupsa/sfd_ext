import { Route } from '@angular/router';

import {BilanGlobalSheetComponent} from './bilan-global';
export const BILAN_GLOBAL_ROUTE: Route[] = [
  {
    path: '',
    component: BilanGlobalSheetComponent,
    data: { authorities: [], pageTitle: 'Bilan global' }
  },
  {
    path: 'bilan-global',
    component: BilanGlobalSheetComponent,
    data: { authorities: [], pageTitle: 'Bilan global' }
  }
];
