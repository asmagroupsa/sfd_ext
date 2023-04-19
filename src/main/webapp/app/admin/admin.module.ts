import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../shared';
import {
    CreatedByPipe,
    AuthorityPipe,
    CreatedDatePipe
} from './user-management/pipe';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

import {
    adminState,
    AuditsComponent,
    UserMgmtComponent,
    UserDialogComponent,
    UserDeleteDialogComponent,
    UserMgmtDetailComponent,
    UserMgmtDialogComponent,
    UserMgmtDeleteDialogComponent,
    LogsComponent,
    JhiMetricsMonitoringModalComponent,
    JhiMetricsMonitoringComponent,
    JhiHealthModalComponent,
    JhiHealthCheckComponent,
    JhiConfigurationComponent,
    JhiDocsComponent,
    AuditsService,
    JhiConfigurationService,
    JhiHealthService,
    JhiMetricsService,
    GatewayRoutesService,
    JhiGatewayComponent,
    LogsService,
    UserResolvePagingParams,
    UserResolve,
    UserModalService,
    UserMgmtRessourcesComponent
} from '.';
import { JhiProfileService } from './profile/profile.service';
import { JhiProfileComponent } from './profile/profile';
import { JhiDeconnexionService } from './deconnexion/deconnexion.service';
import { JhiDeconnexionComponent } from './deconnexion/deconnexion';
import { JhiProfileRessourcesComponent } from './profile/profile-ressources';
import { RessourceService } from '../entities/ressource';
import { ZoneAgenceService } from '../entities/zone-agence/zone-agence.service';
import { GuichetierComponent } from './user-management/guichetier.component';
import { GuichetierPrintComponent } from './user-management/guichetier-print.component';
import { ImageService, UserData, EventBus } from '../shared';

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild(adminState)
        /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    ],
    declarations: [
        AuditsComponent,
        UserMgmtComponent,
        UserDialogComponent,
        UserDeleteDialogComponent,
        UserMgmtDetailComponent,
        UserMgmtDialogComponent,
        UserMgmtDeleteDialogComponent,
        LogsComponent,
        JhiConfigurationComponent,
        JhiHealthCheckComponent,
        JhiHealthModalComponent,
        JhiDocsComponent,
        JhiGatewayComponent,
        JhiMetricsMonitoringComponent,
        JhiMetricsMonitoringModalComponent,
        UserMgmtRessourcesComponent,
        JhiProfileComponent,
        JhiProfileRessourcesComponent,
        CreatedByPipe,
        CreatedDatePipe,
        AuthorityPipe,
        JhiDeconnexionComponent,
        GuichetierComponent,
        GuichetierPrintComponent
    ],
    entryComponents: [
        UserMgmtDialogComponent,
        UserMgmtDeleteDialogComponent,
        JhiHealthModalComponent,
        JhiMetricsMonitoringModalComponent
    ],
    providers: [
        AuditsService,
        ZoneAgenceService,
        JhiConfigurationService,
        JhiHealthService,
        JhiMetricsService,
        GatewayRoutesService,
        LogsService,
        UserResolvePagingParams,
        UserResolve,
        UserModalService,
        JhiProfileService,
        RessourceService,
        JhiDeconnexionService,
        ImageService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdAdminModule {}
