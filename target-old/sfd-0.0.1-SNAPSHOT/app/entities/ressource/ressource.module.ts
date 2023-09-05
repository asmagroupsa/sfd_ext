import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiProfileService } from '../../admin/profile/profile.service';
import { SfdSharedModule } from '../../shared';
import {
  RessourceService,
  RessourcePopupService,
  RessourceComponent,
  RessourceDetailComponent,
  RessourceDialogComponent,
  RessourcePopupComponent,
  RessourceDeletePopupComponent,
  RessourceDeleteDialogComponent,
  ressourceRoute,
  ressourcePopupRoute,
  RessourceResolvePagingParams
} from '.';
import { NecessaryPipe, AlreadyressourcePipe } from './pipe';
import {AddAuthorityDialogComponent} from './add-authority-dialog.component';

const ENTITY_STATES = [...ressourceRoute, ...ressourcePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RessourceComponent,
    RessourceDetailComponent,
    RessourceDialogComponent,
    RessourceDeleteDialogComponent,
    RessourcePopupComponent,
    RessourceDeletePopupComponent,
    NecessaryPipe,
    AddAuthorityDialogComponent,
    AlreadyressourcePipe
  ],
  entryComponents: [
    RessourceComponent,
    RessourceDialogComponent,
    RessourcePopupComponent,
    RessourceDeleteDialogComponent,
    AddAuthorityDialogComponent,
    RessourceDeletePopupComponent
  ],
  providers: [
    RessourceService,
    RessourcePopupService,
    JhiProfileService,
    RessourceResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdRessourceModule { }
