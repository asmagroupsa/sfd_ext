import { Component, OnInit } from '@angular/core';
import {
    Router,
    ActivatedRoute,
    NavigationEnd,
    NavigationStart
} from '@angular/router';
import 'rxjs/add/operator/filter';
import { ressource } from '../entities/entity.module';
import { LOCAL_FLAG } from '.';

@Component({
    selector: 'jhi-breadcrumbs',
    template: `
  <ol class="breadcrumb" *ngIf="breadcrumbs.length">
    <li class="breadcrumb-item" *ngFor="let breadcrumb of breadcrumbs;let last = last"  routerLinkActive="active"  [routerLinkActiveOptions]="{exact:true}">
      <a [routerLink]="breadcrumb.url" [queryParams]="breadcrumb.params"
       *jhiHasAnyRessources="breadcrumb.ressource">{{breadcrumb.label}}</a><em class="sub-alert-badge" *ngIf="breadcrumb.badge">1</em>
    </li>
    </ol>`,
    styles: [
        `
    .breadcrumb{
      background-color:#ddd;
      color:black;
      border-bottom:none;
      padding:0px;
      display: flex;
    }
    .breadcrumb-item a{
      color:black;
      text-decoration:none;
    }
    .breadcrumb-item a:nth-child(1){
      padding-left:5px;
    }
    .breadcrumb-item{
      text-align: center;
      padding:10px;
      font-size:0.8em;
    }
  .breadcrumb-item + .breadcrumb-item::before{
    content: '';
    padding-left:0px;
    padding-right:0px;
  }
  .active{
    color: black;
    background-color:#F9F9F9;;
    pointer-events: none;
    cursor: default;
  }
  `
    ]
})
export class BreadcrumbsComponent implements OnInit {
    breadcrumbs: Array<Object> = [];
    affectationsMenus: Array<string> = [];
    creditMenus: Array<string> = [];
    clientMenu: Array<string> = [];
    dossiersMenu: Array<string> = [];
    comityMenu: Array<string> = [];
    operationsMenu: Array<string> = [];
    partnersMenu: Array<string> = [];
    echeanciersSFDMenu: Array<string> = [];
    produitsMenu: Array<string> = [];
    addressMenu: Array<string> = [];
    caisseMenu: Array<string> = [];
    sousTraitantMenu: Array<string> = [];
    stateMenu: Array<string> = [];
    constructor(private router: Router, private route: ActivatedRoute) {
        this.initiate();
    }
    ngOnInit(): void {
        this.router.events.subscribe((evt: NavigationStart) => {
            if (evt && this.searchUrl(this.creditMenus, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(
                    {
                        label: 'Accord de crédit',
                        url: '/entity/credit/operation/deblocage',
                        translate: 'menus.credits.accord',
                        badge: true,
                        ressource: 'carmesfnmservice/api/credits/getAllCredits'
                    },
                    {
                        label: 'Décaissement',
                        url: '/entity/credit/operation/decaissement',
                        translate: 'menus.credits.decaissement',
                        ressource: 'carmesfnmservice/api/credits/getAllCredits'
                    },
                    {
                        label: 'Crédits en cours',
                        url: '/entity/credit/credit-en-cours',
                        /*  ressource: 'carmesfnmservice/api/credits/getAllCredits' */
                    },
                    {
                        label: 'Crédits en perte',
                        url: '/entity/credit/credit-en-perte',
                        /*  ressource: 'carmesfnmservice/api/credits/getAllCredits' */
                    },
                    {
                        label: 'Crédits en souffrance',
                        url: '/entity/credit/credit-en-souffrance',
                        /*  ressource: 'carmesfnmservice/api/credits/getAllCredits' */
                    },
                    {
                        label: 'Type crédit en retard',
                        url: '/entity/type-credit-retard',
                        /*  ressource: 'carmesfnmservice/api/credits/getAllCredits' */
                    },
                    {
                        label: 'Fiche de crédit',
                        url: '/entity/credit-menu/fiche-client',
                        translate: 'menus.credits.fiche'
                    },
                    {
                        label: 'Fiche de crédit membre',
                        url: '/entity/credit-menu/fiche-credit-member',
                        translate: 'menus.credits.ficheCreditMembre'
                    },
                    // {
                    //     label: 'Echeanciers',
                    //     url: '/entity/echeancier-client',
                    //     translate: 'menus.credits.echeancier',
                    //     ressources: 'carmesfnmservice/api/echeancier-clients/getAllEcheancierlients'
                    // },
                    {
                        label: "Echéancier",
                        url: '/entity/credit-menu/simulation',
                        translate: 'menus.credits.simulation'
                    },
                    {
                        label: "Crédits impayés",
                        url: '/entity/credit/liste-credits-impayes',
                    },
                );
            }
            else if (
                evt &&
                this.searchUrl(this.echeanciersSFDMenu, evt.url)
            ) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(
                    {
                        label: 'Nos banques',
                        url: '/entity/partner',
                        translate: 'menus.partners.partner',
                        ressource:
                            'carmesfnmservice/api/partners/getAllPartners'
                    },
                    {
                        label: 'Demande de ligne de credit',
                        url: '/entity/ligne-request',
                        ressource:
                            'carmesfnmservice/api/ligne-requests/getAllLigneRequests'
                    },
                    {
                        label: 'Ligne de crédit',
                        url: '/entity/ligne-credit',
                        translate: 'menus.partners.ligne',
                        ressource:
                            'carmesfnmservice/api/ligne-credits/getAllLigneCredits'
                    },
                    {
                        label: 'Les compléments de ligne',
                        url: '/entity/ligne-credit/complements',
                        ressource:
                            'carmesfnmservice/api/ligne-credits/getAllLigneCredits'
                    },
                    {
                        label: 'Echéances',
                        url: '/entity/echeancier-sfd',
                        translate: 'menus.partners.echeances'
                    }/* ,
                    {
                        label: 'Remboursements',
                        url: '/entity/remboursement-sfd',
                        translate: 'menus.partners.remboursements',
                        ressource:
                            'carmesfnmservice/api/getAllRemboursementSFDS'
                    }, */
                    /* {
                        label: 'Penalité',
                        url: '/entity/rembt-penal-sfd',
                        translate: 'menus.partners.penalite',
                        ressource:
                            'carmesfnmservice/api/rembt-penal-sfds/getAllRembtPenalSFDS'
                    } */
                );
            } else if (evt && this.searchUrl(this.affectationsMenus, evt.url)) {
                this.breadcrumbs = [];
                /* this.breadcrumbs.push( {
                        label: "Affectations d'agents",
                        url: '/entity/affectation?type=agent',
                        translate: 'menus.affectation.agent',
                        ressource:
                            'carmesfnmservice/api/affectations/getAllAffectations' }
                            {
                        label: "Affectations de clients",
                        url: '/entity/affectation',
                        translate: 'menus.affectation.clients',
                        ressource:
                            'carmesfnmservice/api/affectations/getAllAffectations'},{
                        label: "Affectations de dossier",
                        url: '/entity/affectation',
                        translate: 'menus.affectation.dossier',
                        ressource:
                            'carmesfnmservice/api/affectations/getAllAffectations'});
             */
            } else if (evt && this.searchUrl(this.partnersMenu, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(
                    {
                        label: 'Nos banques',
                        url: '/entity/partner',
                        translate: 'menus.partners.partner',
                        ressource:
                            'carmesfnmservice/api/partners/getAllPartners'
                    }
                );

                // if (!LOCAL_FLAG) {
                    this.breadcrumbs.push(
                        {
                            label: 'Demande de ligne de credit',
                            url: '/entity/ligne-request',
                            ressource:
                                'carmesfnmservice/api/ligne-requests/getAllLigneRequests'
                        }
                    );
                // }

                this.breadcrumbs.push(
                    {
                        label: 'Ligne de crédit',
                        url: '/entity/ligne-credit',
                        translate: 'menus.partners.ligne',
                        ressource:
                            'carmesfnmservice/api/ligne-credits/getAllLigneCredits'
                    },
                    {
                        label: 'Les compléments de ligne',
                        url: '/entity/ligne-credit/complements',
                        ressource:
                            'carmesfnmservice/api/ligne-credits/getAllLigneCredits'
                    },/* ,
                    {
                        label: 'Remboursements',
                        url: '/entity/remboursement-sfd',
                        translate: 'menus.partners.remboursements',
                        ressource:
                            'carmesfnmservice/api/getAllRemboursementSFDS'
                    },
                    {
                        label: 'Penalité',
                        url: '/entity/rembt-penal-sfd',
                        translate: 'menus.partners.penalite',
                        ressource:
                            'carmesfnmservice/api/rembt-penal-sfds/getAllRembtPenalSFDS'
                    } */
                );
            } else if (evt && this.searchUrl(this.clientMenu, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(
                    {
                        label: 'Clients',
                        url: '/entity/client',
                        translate: 'menus.clients.client',
                        ressource: 'carmesfnmservice/api/clients/getAllClients'
                    },
                    {
                        label: 'Responsables',
                        url: '/entity/leader',
                        translate: 'menus.clients.leader',
                        ressource: 'carmesfnmservice/api/leaders/getAllLeaders'
                    },
                    {
                        label: 'Comptes',
                        url: '/entity/compte-client',
                        translate: 'menus.clients.compte',
                        ressource: 'carmesfnmservice/api/comptes/getAllComptes'
                    },
                    {
                        label: "Conditions d'accès",
                        url: '/entity/condition-request',
                        translate: 'menus.dossiers.condition',
                        ressource: 'carmesfnmservice/api/condition-acces/getAllConditionAcces'
                    },
                    {
                        label: "Agents Marchands",
                        url: '/entity/client/liste-agent',
                        // translate: 'menus.dossiers.condition',
                        // ressource: 'carmesfnmservice/api/condition-acces/getAllConditionAcces'
                    },
                );
            } else if (evt && this.searchUrl(this.addressMenu, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(

                    /* {
                        label: 'Type de clients',
                        url: '/entity/type-client',
                        ressource: 'carmesfnmservice/api/clients/getAllClients'
                    }, {
                        label: 'Les frais clients',
                        url: '/entity/frais-client',
                        ressource: 'carmesfnmservice/api/clients/getAllClients'
                    }, */
                    {
                        label: 'Clients',
                        url: '/entity/client',
                        translate: 'menus.clients.client',
                        ressource: 'carmesfnmservice/api/clients/getAllClients'
                    },
                    {
                        label: 'Responsables',
                        url: '/entity/leader',
                        translate: 'menus.clients.leader',
                        ressource: 'carmesfnmservice/api/leaders/getAllLeaders'
                    },
                    {
                        label: 'Comptes',
                        url: '/entity/compte',
                        translate: 'menus.clients.compte',
                        ressource: 'carmesfnmservice/api/comptes/getAllComptes'
                    },
                    {
                        label: 'Adresses',
                        url: '/entity/address',
                        translate: 'menus.clients.address'
                    }
                );
            } else if (evt && this.searchUrl(this.dossiersMenu, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(
                    /* {
                        label: "Conditions d'accès",
                        url: '/entity/condition-request',
                        translate: 'menus.dossiers.condition',
                        ressource: 'carmesfnmservice/api/condition-acces/getAllConditionAcces'
                    }, */
                    {
                        label: 'Demandes & Etudes',
                        url: '/entity/credit-request',
                        translate: 'menus.dossiers.request',
                        badge: true,
                        ressource:
                            'carmesfnmservice/api/credit-requests/getAllCreditRequests'
                    },
                    {
                        label: 'Liste des dossiers',
                        url: '/entity/etude',
                        translate: 'menus.dossiers.etude',
                        ressource: 'carmesfnmservice/api/etudes/getAllEtudes'
                    }
                );
            } else if (evt && this.searchUrl(this.comityMenu, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(
                    {
                        label: 'Réunion de comité',
                        url: '/entity/credit-comity',
                        translate: 'menus.comities.comity',
                        badge: true,
                        ressource:
                            'carmesfnmservice/api/credit-comities/getAllCreditComities'
                    },
                    {
                        label: 'Disponibilités',
                        url: '/entity/disponibilite',
                        translate: 'menus.comities.disponibilite',
                        ressource:
                            'carmesfnmservice/api/disponibilites/getAllDisponibilites'
                    },
                    {
                        label: 'Validations',
                        url: '/entity/validation',
                        translate: 'menus.comities.validation',
                        badge: true,
                        ressource:
                            'carmesfnmservice/api/validations/getAllValidations'
                    },
                    {
                        label: 'Notifications',
                        url: '/entity/notification-client',
                        translate: 'menus.comities.notification',
                        badge: true,
                        ressource:
                            'carmesfnmservice/api/notification-clients/getAllNotificationClients'
                    }
                );
            } else if (evt && this.searchUrl(this.caisseMenu, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(
                    {
                        label: 'Caisse',
                        url: '/entity/caisse-nouvelle',
                        translate: 'menus.caisses.caisse',
                        // ressource: 'carmesfnmservice/api/caisses/getAllCaisses'
                    },
                    {
                        label: 'Opération',
                        url: '/entity/operation-caisse',
                        translate: 'menus.caisses.caisse',
                        // ressource: 'carmesfnmservice/api/caisses/getAllCaisses'
                    },
                    /* {
                        label: 'Caisse principale',
                        url: '/entity/caisse',
                        translate: 'menus.caisses.caisse',
                        ressource: 'carmesfnmservice/api/caisses/getAllCaisses'
                    }, */
                    /* {
                        label: 'Caisse centrale',
                        url: '/entity/caisse-centrale',
                        translate: '',
                        ressource: 'carmesfnmservice/api/caisses/getAllCaisses'
                    }, */
                    /* {
                        label: 'Guichets',
                        url: '/entity/guichet',
                        translate: 'menus.caisses.guichet'
                    },
                    {
                        label: 'Gestion des cautions',
                        url: '/entity/cautions',
                        translate: 'menus.caisses.caution'
                    }, */
                );
            } else if (evt && this.searchUrl(this.operationsMenu, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(
                    /* {
                        label: 'Liste des opérations',
                        url: '/entity/operations/liste'
                    },
                    {
                        label: 'Dêpots',
                        url: '/entity/operations/depots',
                        translate: 'menus.operations.depot'
                    },
                    {
                        label: 'Retraits',
                        url: '/entity/operations/retraits',
                        translate: 'menus.operations.retrait'
                    },
                    {
                        label: 'Transferts',
                        url: '/entity/operations/transferts',
                        translate: 'menus.operations.transfert'
                    },
                    {
                        label: 'Remboursements',
                        url: '/entity/operations/remboursements',
                        translate: 'menus.operations.remboursement'
                    }, */
                    {
                        label: 'Compensations',
                        url: '/entity/compensation',
                        translate: 'menus.operations.compensation',
                        ressource: 'carmesfnmservice/api/compensations/getAllCompensations'
                    },
                    {
                        label: 'Commissions',
                        url: '/entity/commission',
                        translate: 'menus.caisses.commission',
                        ressource: 'carmesfnmservice/api/commissions/getAllCommissions'
                    }/* ,
                    {
                        label: 'Virements',
                        url: '/entity/operations/virements',
                        translate: 'menus.operations.virement'
                    } */
                );
            } else if (evt && this.searchUrl(this.produitsMenu, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(
                    {
                        label: 'Liste des produits',
                        url: '/entity/produit',
                        translate: 'menus.produits.produit',
                        ressource:
                            'carmesfnmservice/api/produits/getAllProduits'
                    },
                    {
                        label: 'Type de garantie',
                        url: '/entity/type-garantie',
                        translate: 'menus.produits.garantie',
                        ressource: [
                            'carmesfnmservice/api/type-garanties/getAllTypeGaranties',
                            'carmesfnmservice/api/produit-type-garanties/getAllProduitTypeGaranties'
                        ]
                    },
                    {
                        label: "Les taux d'épargnes",
                        url: '/entity/taux-epargne',
                        translate: 'menus.produits.epargne',
                        ressource:
                            'carmesfnmservice/api/taux-epargnes/getAllTauxEpargnes'
                    },
                    {
                        label: 'Les frais',
                        url: '/entity/frais',
                        translate: 'menus.produits.frais',
                        ressource: 'carmesfnmservice/api/frais/getAllFrais'
                    },
                    {
                        label: 'La périodicité',
                        url: '/entity/periodicity',
                        translate: 'menus.produits.periodicity',
                        ressource:
                            'carmesfnmservice/api/peridicities/getAllPeridicities'
                    },
                    {
                        label: 'Les types de comptes',
                        url: '/entity/account-type',
                        translate: 'menus.produits.compte',
                        ressource:
                            'carmesfnmservice/api/account-types/getAllAccountTypes'
                    },
                    {
                        label: 'Les tranches pénales',
                        url: '/entity/tranche-penal',
                        translate: 'menus.produits.penalite',
                        ressource:
                            'carmesfnmservice/api/tranche-penals/getAllTranchePenals'
                    },
                    {
                        label: 'Les pénalites',
                        url: '/entity/penality',
                        // translate: 'menus.produits.penalite',
                        ressource: 'carmesfnmservice/api/tranche-penals/getAllTranchePenals'
                    },
                    {
                        label: 'Produit types garanties',
                        url: '/entity/produit-type-garantie',
                        // translate: 'menus.produits.penalite',
                        ressource: 'carmesfnmservice/api/tranche-penals/getAllTranchePenals'
                    }
                );
            } else if (evt && this.searchUrl(this.sousTraitantMenu, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(
            //         '/entity/sous-traitant',
            // '/entity/sous-traitant/compensation-request',
                    {
                        label: 'Sous traitants',
                        url: '/entity/sous-traitant',
                        translate: 'menus.sousTraitants.liste',
                        ressource: 'liste_sous_traitant'
                    },
                    {
                        label: 'Demandes de compensation',
                        url: '/entity/sous-traitant/compensation-request',
                        translate: 'menus.sousTraitants.compensationRequest',
                        ressource: 'liste_demande_compensation_sous_traitant'
                    }
                );
            } else if (evt && this.searchUrl(this.stateMenu, evt.url)) {
                this.breadcrumbs = [];
                this.breadcrumbs.push(

                    {
                        label: 'Taux de remboursement',
                        url: '/stats',
                        translate: '',
                        ressource: ''
                    },
                    {
                        label: 'Rapatriements sur crédit',
                        url: '/stats/rapatriements',
                        translate: '',
                        ressource: ''
                    },
                    {
                        label: 'Crédit accordés',
                        url:  '/stats/etats',
                        translate: '',
                        ressource: '',
                        params:  {link: 'credits-accordes', title: 'Etat de crédit accordés'}
                    },
                    /* {
                        label: 'Crédit accordés par bénéficiaire',
                        url:  '/stats/etats',
                        translate: '',
                        ressource: '',
                        params:  {link: 'credits-accordes-beneficiaires', title: 'Etat de crédit accordés par bénéficiaire'}
                    }, */
                    {
                        label: 'Crédits soldés',
                        url:  '/stats/etats',
                        translate: '',
                        ressource: '',
                        params:  {link: 'credits-solde', title: 'Etat des crédits soldés'}
                    },
                    {
                        label: 'Crédits échus',
                        url:  '/stats/etats',
                        translate: '',
                        ressource: '',
                        params:  {link: 'credits-echus', title: 'Etat des crédits échus'}
                    },
                    {
                        label: 'Encours de crédit',
                        url:  '/stats/etats',
                        translate: '',
                        ressource: '',
                        params:  {link: 'encours-credits', title: 'Etat de l\'encours de crédit'}
                    },
                    {
                        label: 'Remboursements de crédits',
                        url:  '/stats/etats',
                        translate: '',
                        ressource: '',
                        params:  {link: 'credits-remboursement', title: 'Etat de remboursement des crédits'}
                    },
                    {
                        label: 'Remboursement attendus',
                        url:  '/stats/etats',
                        translate: '',
                        ressource: '',
                        params:  {link: 'remboursement-attendu-retard', title: 'Etat de remboursement attendus'}
                    },
                    {
                        label: 'Remboursement prévus',
                        url:  '/stats/etats',
                        translate: '',
                        ressource: '',
                        params:  {link: 'remboursement-prevu-echeance', title: 'Etat de remboursement prévus par échéancier'}
                    },
                    {
                        label: 'Crédits impayés',
                        url:  '/stats/etats',
                        translate: '',
                        ressource: '',
                        params:  {link: 'credits-impaye', title: 'Etat des crédits impayés'}
                    },
                );
            } else {
                this.breadcrumbs = [];
            }
        });
    }
    initiate() {
        this.creditMenus = [
            '/entity/credit/operation/deblocage',
            '/entity/credit/credit-en-cours',
            '/entity/credit-menu/garantie',
            '/entity/credit/operation/decaissement',
            '/entity/credit-menu/fiche-client',
            '/entity/credit-menu/fiche-credit-member',
            '/entity/credit-menu/simulation',
            '/entity/credit/liste-credits-impayes',
            '/entity/credit/credit-en-perte',
            /* "/entity/credit-menu/penalites", */
            /* "/entity/rembt",
      "/entity/rembt-penal", */
            // '/entity/echeancier-client'
        ];
        this.clientMenu = [
            '/entity/client',
            '/entity/leader',
            '/entity/group-member',
            '/entity/compte-client',
            '/entity/condition-request',
            '/entity/client/liste-agent',
        ];
        this.dossiersMenu = [
            '/entity/credit-request',
            '/entity/etude',
            // '/entity/condition-request'
        ];
        this.comityMenu = [
            '/entity/credit-comity',
            '/entity/comity-menu/demandes',
            '/entity/validation',
            '/entity/notification-client',
            '/entity/disponibilite',
            '/entity/contrat'
        ];
        this.operationsMenu = [
            // '/entity/operations/',
            /* "/entity/operations/remboursements", */
            /* "/entity/operations/penalites", */
            '/entity/compensation',
            '/entity/commission',
        ];
        this.echeanciersSFDMenu = ['/entity/echeancier-sfd'];
        this.partnersMenu = [
            '/entity/partner',
            '/entity/ligne-credit',
            '/entity/ligne-credit/complements',
            '/entity/remboursement-sfd',
            '/entity/rembt-penal-sfd',
            '/entity/ligne-request'
        ];

        // if (LOCAL_FLAG) this.partnersMenu.pop();

        this.produitsMenu = [
            '/entity/produit',
            '/entity/type-garantie',
            '/entity/taux-epargne',
            '/entity/frais',
            '/entity/periodicity',
            '/entity/account-type',
            '/entity/tranche-penal',
            "/entity/penality",
            "/entity/produit-type-garantie",
        ];
        this.sousTraitantMenu = [
            '/entity/sous-traitant',
            '/entity/sous-traitant/compensation-request',
        ];
        this.affectationsMenus = ['/entity/affectation'];
        this.addressMenu = ['/entity/address'];
        this.caisseMenu = [
            '/entity/caisse',
            // '/entity/guichet',
            // '/entity/cautions',
    //         '/entity/bank',
    //   '/entity/bank-account',
            // '/entity/brouillard-comptable',
            // '/entity/caisse-centrale',
            '/entity/compte-comptable',
    //   '/entity/journal',
            // '/entity/operation-comptable'
            /* '/entity/type-caisse' */
        ];

        /*[queryParams]="{link: 'credits-accordes-beneficiaires', title: 'Etat de crédit accordés par bénéficiaire'}">Crédit accordés par bénéficiaire</a>
        <a [routerLink]="['/state', 'etats']"
                            [queryParams]="{link: 'credits-accordes', title: 'Etat de crédit accordés'}">Crédit accordés</a>    */
        this.stateMenu = [
            '/stats',
            '/stats/rapatriements',
            '/stats/etats',
        ];
    }
    private searchUrl(urlTabs: string[], url: string): boolean {
        let exist: boolean = false;
        if (!url) return false;
        urlTabs.forEach(element => {
            if (url.startsWith(element)) {
                exist = true;
            }
        });
        return exist;
    }
}
