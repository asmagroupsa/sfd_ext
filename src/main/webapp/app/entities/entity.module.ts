import { SfdEcritureModule } from './ecriture/ecriture.module';
import { SfdTownShipModule } from './town-ship/town-ship.module';
import { SfdRessourceModule } from './ressource/ressource.module';
import { SfdTauxEpargneModule } from './taux-epargne/taux-epargne.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SfdAddressModule } from './address/address.module';
import { SfdClientModule } from './client/client.module';
import { SfdLeaderModule } from './leader/leader.module';
import { SfdAgenceModule } from './agence/agence.module';
import { SfdServiceUserModule } from './service-user/service-user.module';
import { SfdSituationMatModule } from './situation-mat/situation-mat.module';
import { SfdJournalModule } from './journal/journal.module';
import { SfdIdCardTypeModule } from './id-card-type/id-card-type.module';
import { SfdProfessionModule } from './profession/profession.module';
import { SfdNationalityModule } from './nationality/nationality.module';
import { SfdCountryModule } from './country/country.module';
import { SfdDepartementModule } from './departement/departement.module';
import { SfdLiteracyModule } from './literacy/literacy.module';
import { SfdSchoolLevelModule } from './school-level/school-level.module';
import { SfdCreditRequestModule } from './credit-request/credit-request.module';
import { SfdProduitModule } from './produit/produit.module';
import { SfdRequestRaisonModule } from './request-raison/request-raison.module';
import { SfdCreditRequestStatusModule } from './credit-request-status/credit-request-status.module';
import { SfdEtudeModule } from './etude/etude.module';
import { SfdCreditComityModule } from './credit-comity/credit-comity.module';
import { SfdComityMberModule } from './comity-mber/comity-mber.module';
import { SfdNotificationClientModule } from './notification-client/notification-client.module';
import { SfdPeriodicityModule } from './periodicity/periodicity.module';
import { SfdConditionsModule } from './conditions/conditions.module';
import { SfdFraisModule } from './frais/frais.module';
import { SfdTypesContratModule } from './types-contrat/types-contrat.module';
import { SfdConditionGarantieModule } from './condition-garantie/condition-garantie.module';
import { SfdTypeGarantieModule } from './type-garantie/type-garantie.module';
import { SfdTauxModule } from './taux/taux.module';
import { SfdTranchePenalModule } from './tranche-penal/tranche-penal.module';
import { SfdPenalityModule } from './penality/penality.module';
import { SfdCreditModule } from './credit/credit.module';
import { SfdEcheancierClientModule } from './echeancier-client/echeancier-client.module';
import { SfdTypeRembtModule } from './type-rembt/type-rembt.module';
import { SfdRembtModule } from './rembt/rembt.module';
import { SfdRembtPenalModule } from './rembt-penal/rembt-penal.module';
import { SfdCompteModule } from './compte/compte.module';
import { SfdAccountTypeModule } from './account-type/account-type.module';
import { SfdOperationModule } from './operation/operation.module';
import { SfdCompensationModule } from './compensation/compensation.module';
import { SfdCompensationTypeModule } from './compensation-type/compensation-type.module';
import { SfdOperationTypeModule } from './operation-type/operation-type.module';
import { SfdTauxCommissionModule } from './taux-commission/taux-commission.module';
import { SfdCommissionModule } from './commission/commission.module';
import { SfdTrancheTauxFraisModule } from './tranche-taux-frais/tranche-taux-frais.module';
import { SfdOperationCompteTrancheTFModule } from './operation-compte-tranche-tf/operation-compte-tranche-tf.module';
import { SfdGarantieModule } from './garantie/garantie.module';
import { SfdDocumentGarantieModule } from './document-garantie/document-garantie.module';
import { SfdLigneCreditModule } from './ligne-credit/ligne-credit.module';
import { SfdEcheancierSFDModule } from './echeancier-sfd/echeancier-sfd.module';
import { SfdFraisGestionModule } from './frais-gestion/frais-gestion.module';
import { SfdRemboursementSFDModule } from './remboursement-sfd/remboursement-sfd.module';
import { SfdTauxSFDModule } from './taux-sfd/taux-sfd.module';
import { SfdTypeClientModule } from './type-client/type-client.module';
import { SfdTypeMembreModule } from './type-membre/type-membre.module';
import { SfdCompteCommissionModule } from './compte-commission/compte-commission.module';
import { SfdPartnerModule } from './partner/partner.module';
import { SfdTranchePenalSFDModule } from './tranche-penal-sfd/tranche-penal-sfd.module';
import { SfdSFDModule } from './s-fd/sfd.module';
import { SfdContratModule } from './contrat/contrat.module';
import { SfdNotificationSFDModule } from './notification-sfd/notification-sfd.module';
import { SfdLigneRequestModule } from './ligne-request/ligne-request.module';
import { SfdGroupMemberModule } from './group-member/group-member.module';
import { SfdEligibleModule } from './eligible/eligible.module';
import { SfdFraisGestionAccordeModule } from './frais-gestion-accorde/frais-gestion-accorde.module';
import { SfdRembtPenalSFDModule } from './rembt-penal-sfd/rembt-penal-sfd.module';
import { SfdFormationModule } from './formation/formation.module';
import { SfdMatiereModule } from './matiere/matiere.module';
import { SfdSettingSFDModule } from './setting-sfd/setting-sfd.module';
import { RouterModule } from '@angular/router';
import { SfdCreditMenuModule } from './credits-menu/credit-menu.module';
import { SfdOperationsModule } from './operations/operation.module';
import { SfdComityMenuModule } from './comity-menu/comity-menu.module';
import { SfdDisponibiliteModule } from './disponibilite/disponibilite.module';
import { SfdValidationModule } from './validation/validation.module';
import { SfdDossierModule } from './dossier/dossier.module';
import { SfdConditionAccesModule } from './condition-acces/condition-acces.module';
import { SfdDelegatedMemberModule } from './delegated-member/delegated-member.module';
import { SfdDelegationComityModule } from './delegation-comity/delegation-comity.module';
import { SfdPosteModule } from './poste/poste.module';
import { SfdCategorieProduitModule } from './categorie-produit/categorie-produit.module';
import { SfdConditionRequestModule } from './condition-request/condition-request.module';
import { SfdCategorieConditionModule } from './categorie-condition/categorie-condition.module';
import { SfdClientConditionNoteModule } from './client-condition-note/client-condition-note.module';
import { SfdClientConditionValueModule } from './client-condition-value/client-condition-value.module';
import { SfdElementConditionModule } from './element-condition/element-condition.module';
import { SfdCaisseModule } from './caisse/caisse.module';
import { SfdGuichetModule } from './guichet/guichet.module';
import { SfdCautionsModule } from './cautions/cautions.module';
import { SfdTypeCaisseModule } from './type-caisse/type-caisse.module';
import { SfdOperationComptableModule } from './operation-comptable/operation-comptable.module';
import { SfdAffectationModule } from './affectation/affectation.module';
import { SfdCaisseCentraleModule } from './caisse-centrale/caisse.module';
import { SfdZoneAgenceModule } from './zone-agence/zone-agence.module';
import { SfdFraisClientModule } from './frais-client/frais.module';
import { SfdProduitTypeGarantieModule } from './produit-type-garantie/produit-type-garantie.module';
import { SfdAuthorityResourceModule } from './authority-resource/authority-resource.module';
import { SfdBudgetModule } from './budget/budget.module';
import { SfdDistrictModule } from './district/district.module';
import { SfdCityModule } from './city/city.module';
import { SfdCivilityModule } from './civility/civility.module';
import { SfdBankModule } from './bank/bank.module';
import { SfdBankAccountModule } from './bank-account/bank-account.module';
import {SfdBankAccountClientModule} from './bank-account-client/bank-account-client.module';
import {SfdCompteComptableModule} from './compte-comptable/compte-comptable.module';
import { SfdRequestPatnerModule } from './request-patner/request-patner.module';
import { SfdAssuranceModule } from './assurances/assurance.module';
import { SfdPhaseModule } from './phase/phase.module';
import { SfdTypeCreditRetardModule } from './type-credit-retard/type-credit-retard.module';
import { SfdOperationCaisseModule } from './operation-caisse/operation-caisse.module';
import { SfdOperationDatModule } from './operation-dat/operation-dat.module';
import { SfdCaisseNouvelleModule } from './caisse-nouvelle/caisse-nouvelle.module';
import { SfdSouscriptionModule } from './souscription/souscription.module';


export function authorityRessource() {
    return SfdAuthorityResourceModule;
}
export function elementCondition() {
    return SfdElementConditionModule;
}
export function assurance() {
    return SfdAssuranceModule;
}
export function phase() {
    return SfdPhaseModule;
}

export function typeCreditRetard() {
    return SfdTypeCreditRetardModule;
}

export function produitTypeGarantie() {
    return SfdProduitTypeGarantieModule;
}
export function district() {
    return SfdDistrictModule;
}
export function city() {
    return SfdCityModule;
}
export function ecriture() {
    return SfdEcritureModule;
}
export function categorieCondition() {
    return SfdCategorieConditionModule;
}
export function dossier() {
    return SfdDossierModule;
}

export function comityMenu() {
    return SfdComityMenuModule;
}
export function creditMenu() {
    return SfdCreditMenuModule;
}
export function address() {
    return SfdAddressModule;
}
export function rembtPenalSFD() {
    return SfdRembtPenalSFDModule;
}
export function profession() {
    return SfdProfessionModule;
}
export function categorieProduit() {
    return SfdCategorieProduitModule;
}
export function nationality() {
    return SfdNationalityModule;
}
export function departement() {
    return SfdDepartementModule;
}
export function typeClient() {
    return SfdTypeClientModule;
}
export function typeMembre() {
    return SfdTypeMembreModule;
}
export function country() {
    return SfdCountryModule;
}
export function literacy() {
    return SfdLiteracyModule;
}
export function schoolLevel() {
    return SfdSchoolLevelModule;
}
export function creditRequest() {
    return SfdCreditRequestModule;
}
export function produit() {
    return SfdProduitModule;
}
export function civility() {
    return SfdCivilityModule;
}
export function requestRaison() {
    return SfdRequestRaisonModule;
}
export function requestPatnerModule() {
    return SfdRequestPatnerModule;
}
export function creditRequestStatus() {
    return SfdCreditRequestStatusModule;
}
export function townShip() {
    return SfdTownShipModule;
}
export function periodicity() {
    return SfdPeriodicityModule;
}
export function budget() {
    return SfdBudgetModule;
}
export function etude() {
    return SfdEtudeModule;
}

export function comityMber() {
    return SfdComityMberModule;
}
export function creditComity() {
    return SfdCreditComityModule;
}
export function zoneAgence() {
    return SfdZoneAgenceModule;
}
export function credit() {
    return SfdCreditModule;
}
export function echeancierClient() {
    return SfdEcheancierClientModule;
}
export function typeRembt() {
    return SfdTypeRembtModule;
}
export function frais() {
    return SfdFraisModule;
}
export function typeContrat() {
    return SfdTypesContratModule;
}
export function conditions() {
    return SfdConditionsModule;
}
export function notificationClient() {
    return SfdNotificationClientModule;
}
export function ligneRequest() {
    return SfdLigneRequestModule;
}
export function groupMember() {
    return SfdGroupMemberModule;
}
export function eligible() {
    return SfdEligibleModule;
}
export function fraisGestionAccorde() {
    return SfdFraisGestionAccordeModule;
}
export function affectation() {
    return SfdAffectationModule;
}
export function typeGarantie() {
    return SfdTypeGarantieModule;
}
export function conditionGarantie() {
    return SfdConditionGarantieModule;
}
export function taux() {
    return SfdTauxModule;
}
export function tranchePenal() {
    return SfdTranchePenalModule;
}
export function penality() {
    return SfdPenalityModule;
}
export function tranchePenalSfd() {
    return SfdTranchePenalSFDModule;
}
export function sfd() {
    return SfdSFDModule;
} export function bank() {
    return SfdBankModule;
}
export function bankAccount() {
    return SfdBankAccountModule;
}
export function contrat() {
    return SfdContratModule;
}
export function partner() {
    return SfdPartnerModule;
}
export function notificationSfd() {
    return SfdNotificationSFDModule;
}
export function compensation() {
    return SfdCompensationModule;
}
export function compensationType() {
    return SfdCompensationTypeModule;
}
export function client() {
    return SfdClientModule;
}
export function leader() {
    return SfdLeaderModule;
}
export function agence() {
    return SfdAgenceModule;
}
export function serviceUser() {
    return SfdServiceUserModule;
}
export function situationMat() {
    return SfdSituationMatModule;
}
export function idCardType() {
    return SfdIdCardTypeModule;
}
export function validation() {
    return SfdValidationModule;
}
export function matiere() {
    return SfdMatiereModule;
}
export function settingSfd() {
    return SfdSettingSFDModule;
}
export function echeancierSfd() {
    return SfdEcheancierSFDModule;
}
export function fraisGestion() {
    return SfdFraisGestionModule;
}
export function remboursementSfd() {
    return SfdRemboursementSFDModule;
}
export function ressource() {
    return SfdRessourceModule;
}

export function souscription() {
    return SfdSouscriptionModule;
}
export function tauxCommission() {
    return SfdTauxCommissionModule;
}
export function operationType() {
    return SfdOperationTypeModule;
}
export function rembtPenal() {
    return SfdRembtPenalModule;
}
export function rembt() {
    return SfdRembtModule;
}
export function disponibilite() {
    return SfdDisponibiliteModule;
}
export function formation() {
    return SfdFormationModule;
}
export function compte() {
    return SfdCompteModule;
}
export function accountType() {
    return SfdAccountTypeModule;
}
export function operations() {
    return SfdOperationsModule;
}
export function operation() {
    return SfdOperationModule;
}

export function fraisClient() {
    return SfdFraisClientModule;
}
export function journal() {
    return SfdJournalModule;
}
export function compteCommission() {
    return SfdCompteCommissionModule;
}
export function tauxSfd() {
    return SfdTauxSFDModule;
}
export function trancheTauxFrais() {
    return SfdTrancheTauxFraisModule;
}
export function operationCompteTrancheTf() {
    return SfdOperationCompteTrancheTFModule;
}
export function garantie() {
    return SfdGarantieModule;
}
export function documentGarantie() {
    return SfdDocumentGarantieModule;
}
export function commission() {
    return SfdCommissionModule;
}
export function ligneCredit() {
    return SfdLigneCreditModule;
}
export function conditionAcces() {
    return SfdConditionAccesModule;
}
export function delegatedMember() {
    return SfdDelegatedMemberModule;
}
export function delegationComity() {
    return SfdDelegationComityModule;
}
export function poste() {
    return SfdPosteModule;
}
export function tauxEpargne() {
    return SfdTauxEpargneModule;
}
export function conditionRequest() {
    return SfdConditionRequestModule;
}
export function clientConditionNote() {
    return SfdClientConditionNoteModule;
}
export function clientConditionValue() {
    return SfdClientConditionValueModule;
}

export function operationCaisse() {
    return SfdOperationCaisseModule;
}
export function operationDAT() {
    return SfdOperationDatModule;
}
export function caisseNouvelle() {
    return SfdCaisseNouvelleModule;
}

export function caisse() {
    return SfdCaisseModule;
}
export function caisseCentrale() {
    return SfdCaisseCentraleModule;
}
export function guichet() {
    return SfdGuichetModule;
}
export function cautions() {
    return SfdCautionsModule;
}
export function typeCaisse() {
    return SfdTypeCaisseModule;
}
export function operationComptable() {
    return SfdOperationComptableModule;
}
export function bankAccountClient() {
    return SfdBankAccountClientModule;
}
export function compteComptable() {
    return SfdCompteComptableModule;
}

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'cautions',
                loadChildren: cautions
            },
            {
                path: 'affectation',
                loadChildren: affectation
            },
            {
                path: 'operation-comptable',
                loadChildren: operationComptable
            }, {
                path: 'budget',
                loadChildren: budget
            },
            {
                path: 'type-caisse',
                loadChildren: typeCaisse
            },
            {
                path: 'guichet',
                loadChildren: guichet
            },
            {
                path: 'operation-caisse',
                loadChildren: operationCaisse
            },
            {
                path: 'operation-dat',
                loadChildren: operationDAT
            },

            {
                path: 'caisse-nouvelle',
                loadChildren: caisseNouvelle
            },

            {
                path: 'caisse',
                loadChildren: caisse
            },
            {
                path: 'caisse-centrale',
                loadChildren: caisseCentrale
            },
            {
                path: 'element-condition',
                loadChildren: elementCondition
            },
            {
                path: 'produit-type-garantie',
                loadChildren: produitTypeGarantie
            },
            {
                path: 'client-condition-value',
                loadChildren: clientConditionValue
            },
            {
                path: 'client-condition-note',
                loadChildren: clientConditionNote
            },
            {
                path: 'categorie-condition',
                loadChildren: categorieCondition
            },
            {
                path: 'taux-epargne',
                loadChildren: tauxEpargne
            },
            {
                path: 'condition-request',
                loadChildren: conditionRequest
            },
            {
                path: 'poste',
                loadChildren: poste
            },
            {
                path: 'delegation-comity',
                loadChildren: delegationComity
            },
            {
                path: 'frais-client',
                loadChildren: fraisClient
            },
            {
                path: 'type-contrat',
                loadChildren: typeContrat
            },
            {
                path: 'zone-agence',
                loadChildren: zoneAgence
            },
            {
                path: 'delegated-member',
                loadChildren: delegatedMember
            },
            {
                path: 'condition-acces',
                loadChildren: conditionAcces
            },
            {
                path: 'dossier',
                loadChildren: dossier
            },
            {
                path: 'disponibilite',
                loadChildren: disponibilite
            },
            {
                path: 'comity-menu',
                loadChildren: comityMenu
            },
            {
                path: 'type-credit-retard',
                loadChildren: typeCreditRetard
            },
            {
                path: 'credit-menu',
                loadChildren: creditMenu
            },
            {
                path: 'address',
                loadChildren: address
            },
            {
                path: 'categorie-produit',
                loadChildren: categorieProduit
            },
            {
                path: 'rembt-penal-sfd',
                loadChildren: rembtPenalSFD
            },
            {
                path: 'profession',
                loadChildren: profession
            },
            {
                path: 'nationality',
                loadChildren: nationality
            },
            {
                path: 'departement',
                loadChildren: departement
            },
            {
                path: 'country',
                loadChildren: country
            },
            {
                path: 'literacy',
                loadChildren: literacy
            },
            {
                path: 'school-level',
                loadChildren: schoolLevel
            },
            {
                path: 'credit-request',
                loadChildren: creditRequest
            },
            {
                path: 'produit',
                loadChildren: produit
            },
            {
                path: 'request-partner',
                loadChildren: requestPatnerModule
            },
            {
                path: 'request-raison',
                loadChildren: requestRaison
            },
            {
                path: 'credit-request-status',
                loadChildren: creditRequestStatus
            },
            {
                path: 'periodicity',
                loadChildren: periodicity
            },
            {
                path: 'etude',
                loadChildren: etude
            },
            {
                path: 'credit-comity',
                loadChildren: creditComity
            },
            {
                path: 'comity-mber',
                loadChildren: comityMber
            },
            {
                path: 'authority-ressource',
                loadChildren: authorityRessource
            },
            {
                path: 'notification-client',
                loadChildren: notificationClient
            },
            {
                path: 'conditions',
                loadChildren: conditions
            },
            {
                path: 'frais',
                loadChildren: frais
            },
            {
                path: 'type-rembt',
                loadChildren: typeRembt
            },
            {
                path: 'echeances-client',
                loadChildren: echeancierClient
            },
            {
                path: 'echeancier-client',
                loadChildren: echeancierClient
            },
            {
                path: 'credit',
                loadChildren: credit
            },
            {
                path: 'validation',
                loadChildren: validation
            },
            {
                path: 'tranche-penal',
                loadChildren: tranchePenal
            },
            {
                path: 'penality',
                loadChildren: penality
            },
            {
                path: 'taux',
                loadChildren: taux
            },
            {
                path: 'ecriture',
                loadChildren: ecriture
            },
            {
                path: 'civility',
                loadChildren: civility
            },
            {
                path: 'condition-garantie',
                loadChildren: conditionGarantie
            },
            {
                path: 'type-garantie',
                loadChildren: typeGarantie
            },
            {
                path: 'frais-gestion-accorde',
                loadChildren: fraisGestionAccorde
            },
            {
                path: 'eligible',
                loadChildren: eligible
            },
            {
                path: 'group-member',
                loadChildren: groupMember
            },
            {
                path: 'ligne-request',
                loadChildren: ligneRequest
            },
            {
                path: 'notification-sfd',
                loadChildren: notificationSfd
            },
            {
                path: 'notification-sfd',
                loadChildren: notificationSfd
            },
            {
                path: 'partner',
                loadChildren: partner
            }, {
                path: 'bank',
                loadChildren: bank
            },
            {
                path: 'bank-account',
                loadChildren: bankAccount
            },
            {
                path: 'journal',
                loadChildren: journal
            },
            {
                path: 'contrat',
                loadChildren: contrat
            },
            {
                path: 'sfd',
                loadChildren: sfd
            },
            {
                path: 'tranche-penal-sfd',
                loadChildren: tranchePenalSfd
            },
            {
                path: 'city',
                loadChildren: city
            },
            {
                path: 'town-ship',
                loadChildren: townShip
            },
            {
                path: 'comity-mber',
                loadChildren: comityMber
            },
            {
                path: 'setting-sfd',
                loadChildren: settingSfd
            },
            {
                path: 'matiere',
                loadChildren: matiere
            },
            {
                path: 'id-card-type',
                loadChildren: idCardType
            },
            {
                path: 'situation-mat',
                loadChildren: situationMat
            },
            {
                path: 'service-user',
                loadChildren: serviceUser
            },
            {
                path: 'agence',
                loadChildren: agence
            },
            {
                path: 'leader',
                loadChildren: leader
            },
            {
                path: 'client',
                loadChildren: client
            },
            {
                path: 'compensation-type',
                loadChildren: compensationType
            },
            {
                path: 'compensation',
                loadChildren: compensation
            },
            {
                path: 'operation',
                loadChildren: operation
            },
            {
                path: 'operations',
                loadChildren: operations
            },
            {
                path: 'account-type',
                loadChildren: accountType
            },
            {
                path: 'compte-client',
                loadChildren: compte
            },
            {
                path: 'ressource',
                loadChildren: ressource
            },
            {
                path: 'souscription',
                loadChildren: souscription
            },
            {
                path: 'formation',
                loadChildren: formation
            },
            {
                path: 'rembt',
                loadChildren: rembt
            },
            {
                path: 'rembt-penal',
                loadChildren: rembtPenal
            },
            {
                path: 'operation-type',
                loadChildren: operationType
            },
            {
                path: 'taux-commission',
                loadChildren: tauxCommission
            },
            {
                path: 'remboursement-sfd',
                loadChildren: remboursementSfd
            },
            {
                path: 'frais-gestion',
                loadChildren: fraisGestion
            },
            {
                path: 'echeancier-sfd',
                loadChildren: echeancierSfd
            },
            {
                path: 'ligne-credit',
                loadChildren: ligneCredit
            },
            {
                path: 'commission',
                loadChildren: commission
            },
            {
                path: 'document-garantie',
                loadChildren: documentGarantie
            },
            {
                path: 'garantie',
                loadChildren: garantie
            },
            {
                path: 'operation-compte-tranche-tf',
                loadChildren: operationCompteTrancheTf
            },
            {
                path: 'tranche-taux-frais',
                loadChildren: trancheTauxFrais
            },
            {
                path: 'taux-sfd',
                loadChildren: tauxSfd
            },
            {
                path: 'district',
                loadChildren: district
            },
            {
                path: 'compte-commission',
                loadChildren: compteCommission
            },
            {
                path: 'type-membre',
                loadChildren: typeMembre
            },
            {
                path: 'type-client',
                loadChildren: typeClient
            },
            {
                path: 'bank-account-client',
                loadChildren: bankAccountClient
            },
            {
                path: 'compte-comptable',
                loadChildren: compteComptable
            },
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdEntityModule { }
