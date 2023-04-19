import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  DocumentGarantieService,
  DocumentGarantiePopupService,
  DocumentGarantieComponent,
  DocumentGarantieDetailComponent,
  DocumentGarantieDialogComponent,
  DocumentGarantiePopupComponent,
  DocumentGarantieDeletePopupComponent,
  DocumentGarantieDeleteDialogComponent,
  documentGarantieRoute,
  documentGarantiePopupRoute,
  DocumentGarantieResolvePagingParams
} from '.';

const ENTITY_STATES = [...documentGarantieRoute, ...documentGarantiePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DocumentGarantieComponent,
    DocumentGarantieDetailComponent,
    DocumentGarantieDialogComponent,
    DocumentGarantieDeleteDialogComponent,
    DocumentGarantiePopupComponent,
    DocumentGarantieDeletePopupComponent
  ],
  entryComponents: [
    DocumentGarantieComponent,
    DocumentGarantieDialogComponent,
    DocumentGarantiePopupComponent,
    DocumentGarantieDeleteDialogComponent,
    DocumentGarantieDeletePopupComponent
  ],
  providers: [
    DocumentGarantieService,
    DocumentGarantiePopupService,
    DocumentGarantieResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdDocumentGarantieModule {}
