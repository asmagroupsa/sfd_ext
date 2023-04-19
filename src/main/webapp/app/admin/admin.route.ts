import { Routes } from '@angular/router';

import {
    auditsRoute,
    configurationRoute,
    docsRoute,
    healthRoute,
    logsRoute,
    metricsRoute,
    gatewayRoute,
    userMgmtRoute,
    userDialogRoute
} from '.';

import { UserRouteAccessService } from '../shared';
import { profileRoute, profileRessourceRoute } from './profile/profile.route';
import { deconnexionRoute } from './deconnexion/deconnexion.route';

const ADMIN_ROUTES = [
    auditsRoute,
    configurationRoute,
    docsRoute,
    healthRoute,
    logsRoute,
    gatewayRoute,
    ...userMgmtRoute,
    metricsRoute,
    profileRoute,
    profileRessourceRoute,
    deconnexionRoute
];

export const adminState: Routes = [...ADMIN_ROUTES, ...userDialogRoute];
