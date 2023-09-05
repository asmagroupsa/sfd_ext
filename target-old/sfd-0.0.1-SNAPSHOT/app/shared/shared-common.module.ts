import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { jhiFnmTranslateComponent } from './myTranslation/fnm-translate';
import { HasAnyRessourcesDirective } from './model/ressources.directives';
import {
  SfdSharedLibsModule,
  JhiLanguageHelper,
  FindLanguageFromKeyPipe,
  JhiAlertComponent,
  JhiAlertErrorComponent
} from '.';
import { ShowPhotoComponent } from './show-photo.component';

@NgModule({
  imports: [SfdSharedLibsModule, RouterModule],
  declarations: [
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    BreadcrumbsComponent,
    ShowPhotoComponent,
    jhiFnmTranslateComponent,
    HasAnyRessourcesDirective
  ],
  providers: [JhiLanguageHelper, Title],
  exports: [
    SfdSharedLibsModule,
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    BreadcrumbsComponent,
    ShowPhotoComponent,
    jhiFnmTranslateComponent,
    HasAnyRessourcesDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdSharedCommonModule { }
