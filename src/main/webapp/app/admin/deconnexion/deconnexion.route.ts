import { Route } from '@angular/router';

import { JhiDeconnexionComponent } from './deconnexion';

export const deconnexionRoute: Route = {
    path: 'deconnected-user',
    component: JhiDeconnexionComponent,
    data: {
        pageTitle: ''
    }
};
