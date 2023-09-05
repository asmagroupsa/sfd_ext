import { ClientAssuranceComponent } from './client-assurance.component';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  ClientComponent,
  ClientDeleteDialogComponent,
  ClientDeletePopupComponent,
  ClientDetailComponent,
  ClientDialogComponent,
  ClientPopupComponent,
  clientPopupRoute,
  ClientPopupService,
  ClientResolvePagingParams,
  clientRoute,
  ClientService,
} from '.';
import {ActeurCommissionSheetComponent} from './acteur-commission-sheet.component';
import { SfdSharedModule } from '../../shared';
import { ImageService } from '../../shared/image.service';
import { AffectationService } from '../affectation/affectation.service';
import { AgenceService } from '../agence/agence.service';
import { CivilityService } from '../civility/civility.service';
import { CountryService } from '../country/country.service';
import { GroupMemberService } from '../group-member/group-member.service';
import { IdCardTypeService } from '../id-card-type/id-card-type.service';
import { LeaderService } from '../leader/leader.service';
import { LiteracyService } from '../literacy/literacy.service';
import { NationalityService } from '../nationality/nationality.service';
import { OperationComptableService } from '../operation-comptable/operation-comptable.service';
import { PosteService } from '../poste/poste.service';
import { ProduitService } from '../produit/produit.service';
import { ProfessionService } from '../profession/profession.service';
import { SchoolLevelService } from '../school-level/school-level.service';
import { ServiceUserService } from '../service-user/service-user.service';
import { SituationMatService } from '../situation-mat/situation-mat.service';
import { TypeClientService } from '../type-client/type-client.service';
import { ActiverPrintSheetComponent } from './activer-print-sheet.component';
import { ClientConditionAccesSheetComponent } from './client-condition-acces-sheet.component';
import { ClientIndetificationSheetComponent } from './client-indetification-sheet.component';
import { ClientMembershipFormComponent } from './client-membership-form.component';
import { ClientPipe, MembreUniquePipe, RolesPipe, StatusPipe, TypeClientPipe } from './client-pipe';
import { ClientReleveComponent } from './client-releve.component';
import { ClientPPComponent } from './clientpp.component';
import { GroupMemberPipe } from './group-member-pipe';
import { GroupMembersListModalComponent } from './group-members-modal.component';
import { LeaderPipe } from './leader-pipe';
import {ClientMembershipFormNewComponent} from './client-membership-form-new.component';
import {AddressService} from '../address/address.service';
import { ClientMarchandSheetComponent } from './client-marchand-sheet.component';
import {SPUtilService} from "../../shared/sp-util.service";
import {SPClientService} from "../../shared/sp-client.service";
import {SPFNMService} from "../../shared/sp-fnm.service";
import {DepartementService} from "../departement/departement.service";
import {SFDService} from "../s-fd/sfd.service";
import {TownShipService} from "../town-ship/town-ship.service";
import {DistrictService} from "../district/district.service";
import {CityService} from "../city/city.service";
import {ListeAgentComponent} from "./liste-agent.component";
import {ListeAgentPDFComponent} from "./liste-agent-pdf.component";
import {UtilService} from "../../shared/util.service";
import { InitPasswordDialogComponent } from './init-password-dialog.component';
import { SPOperationService } from '../../shared/sp-operation.service';
import { AssuranceService } from '../assurances';

const ENTITY_STATES = [...clientRoute, ...clientPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ClientMarchandSheetComponent,
    ClientConditionAccesSheetComponent,
    ClientReleveComponent,
    ClientComponent,
    ClientDetailComponent,
    ClientDialogComponent,
    ClientPopupComponent,
    ClientDeletePopupComponent,
    TypeClientPipe,
    ClientPipe,
    MembreUniquePipe,
    StatusPipe,
    GroupMemberPipe,
    RolesPipe,
    LeaderPipe,
    ClientIndetificationSheetComponent,
    ClientMembershipFormComponent,
    GroupMembersListModalComponent,
    ActiverPrintSheetComponent,
    ClientPPComponent,
    ClientMembershipFormNewComponent,
    ClientDeleteDialogComponent,
    ActeurCommissionSheetComponent,
    ListeAgentComponent,
    ListeAgentPDFComponent,
    InitPasswordDialogComponent,
    ClientAssuranceComponent
  ],
  entryComponents: [
    ClientMarchandSheetComponent,
    ClientConditionAccesSheetComponent,
    ClientReleveComponent,
    ClientComponent,
    ClientPPComponent,
    ClientIndetificationSheetComponent,
    ClientDialogComponent,
    ClientPopupComponent,
    ClientDeleteDialogComponent,
    ClientDeletePopupComponent,
    ActeurCommissionSheetComponent,
    InitPasswordDialogComponent,
    ClientAssuranceComponent
  ],
  providers: [
    ImageService,
    AffectationService,
    GroupMemberService,
    PosteService,
    LeaderService,
    ServiceUserService,
    TypeClientService,
    SchoolLevelService,
    LiteracyService,
    CountryService,
    NationalityService,
    ProfessionService,
    IdCardTypeService,
    SituationMatService,
    OperationComptableService,
    CivilityService,
    AgenceService,
    ClientService,
    ClientPopupService,
    ClientResolvePagingParams,
    MembreUniquePipe,
    StatusPipe,
    ProduitService,
    CurrencyPipe, DatePipe,
    AddressService,
    SPUtilService,
    SPClientService,
    DecimalPipe,
    SPFNMService,
    DepartementService,
    SFDService,
    DistrictService,
    CityService,
    TownShipService,
    UtilService,
    UtilService,
    SPOperationService,
    AssuranceService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdClientModule {}
