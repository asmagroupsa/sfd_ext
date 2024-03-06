import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared/shared.module';

import { SouscriptionGouvernanceUniverselleDeleteDialogComponent, SouscriptionGouvernanceUniverselleDeletePopupComponent, SouscriptionGouvernanceUniverselleDetailComponent } from '.';
import { ClientService } from '../client';
import { PeriodicityService } from '../periodicity';
import { CountryService } from '../country';
import { SOUSCRIPTIONGOUVERNANCEUNIVERSELLEResolvePagingParams, souscriptionGouvernanceUniversellePopupRoute, souscriptionGouvernanceUniverselleRoute } from './souscription-gouvernance-universelle.route';
import { SOUSCRIPTIONGOUVERNANCEUNIVERSELLEComponent } from './souscription-gouvernance-universelle.component';
import { SouscriptionGouvernanceUniverselleDialogComponent, SouscriptionGouvernanceUniversellePopupComponent } from './souscription-gouvernance-universelle-dialog.component';
import { SouscriptionGouvernanceUniverselleService } from './souscription-gouvernance-universelle.service';
import { SouscriptionGouvernanceUniversellePopupService } from './souscription-gouvernance-universelle-popup.service';

const ENTITY_STATES = [...souscriptionGouvernanceUniverselleRoute, ...souscriptionGouvernanceUniversellePopupRoute];

@NgModule({
    imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        SOUSCRIPTIONGOUVERNANCEUNIVERSELLEComponent,
        SouscriptionGouvernanceUniverselleDetailComponent,
        SouscriptionGouvernanceUniverselleDialogComponent,
        SouscriptionGouvernanceUniverselleDeleteDialogComponent,
        SouscriptionGouvernanceUniversellePopupComponent,
        SouscriptionGouvernanceUniverselleDeletePopupComponent
    ],
    entryComponents: [
        SOUSCRIPTIONGOUVERNANCEUNIVERSELLEComponent,
        SouscriptionGouvernanceUniverselleDialogComponent,
        SouscriptionGouvernanceUniversellePopupComponent,
        SouscriptionGouvernanceUniverselleDeleteDialogComponent,
        SouscriptionGouvernanceUniverselleDeletePopupComponent
    ],
    providers: [
        ClientService,
        SouscriptionGouvernanceUniverselleService,
        SouscriptionGouvernanceUniversellePopupService,
        PeriodicityService,
        CountryService,
        SOUSCRIPTIONGOUVERNANCEUNIVERSELLEResolvePagingParams
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GouvernanceUniverselleSouscriptionModule { }
