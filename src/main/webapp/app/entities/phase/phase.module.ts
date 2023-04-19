import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SfdSharedModule} from '../../shared/shared.module';
import {
    PhaseService,
    PhasePopupService,
    PhaseComponent,
    PosteDetailComponent,
    PhaseDialogComponent,
    PhasePopupComponent,
    PosteDeletePopupComponent,
    PosteDeleteDialogComponent,
    posteRoute,
    postePopupRoute,
    PosteResolvePagingParams
} from '.';
import {ProduitService} from "../produit/produit.service";

const ENTITY_STATES = [...posteRoute, ...postePopupRoute];

@NgModule({
    imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PhaseComponent,
        PosteDetailComponent,
        PhaseDialogComponent,
        PosteDeleteDialogComponent,
        PhasePopupComponent,
        PosteDeletePopupComponent,
    ],
    entryComponents: [
        PhaseComponent,
        PhaseDialogComponent,
        PhasePopupComponent,
        PosteDeleteDialogComponent,
        PosteDeletePopupComponent
    ],
    providers: [
        PhaseService,
        PhasePopupService,
        PosteResolvePagingParams,
        ProduitService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdPhaseModule {}
