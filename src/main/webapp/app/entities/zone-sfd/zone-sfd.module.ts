import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
    ZoneSfdService,
    ZoneSfdPopupService,
    ZoneSfdComponent,
    ZoneSfdDetailComponent,
    ZoneSfdDialogComponent,
    ZoneSfdPopupComponent,
    ZoneSfdDeletePopupComponent,
    ZoneSfdDeleteDialogComponent,
    zoneSfdRoute,
    zoneSfdPopupRoute,
    ZoneSfdResolvePagingParams,
} from '.';

const ENTITY_STATES = [
    ...zoneSfdRoute,
    ...zoneSfdPopupRoute,
];

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ZoneSfdComponent,
        ZoneSfdDetailComponent,
        ZoneSfdDialogComponent,
        ZoneSfdDeleteDialogComponent,
        ZoneSfdPopupComponent,
        ZoneSfdDeletePopupComponent,
    ],
    entryComponents: [
        ZoneSfdComponent,
        ZoneSfdDialogComponent,
        ZoneSfdPopupComponent,
        ZoneSfdDeleteDialogComponent,
        ZoneSfdDeletePopupComponent,
    ],
    providers: [
        ZoneSfdService,
        ZoneSfdPopupService,
        ZoneSfdResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdZoneSfdModule {}
