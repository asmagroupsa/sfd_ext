import {Component, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";
import {CreditService} from "./credit.service";
import {UserData} from "../../shared/index";
import {SPReportService} from "../../shared/sp-report.service";

declare const pdfMake;
declare const toWords;
declare const qrGenerator;

@Component({
    selector: 'jhi-contrat-mcm',
    templateUrl: './contrat-mcm.component.html',
}) 
export class ContratMCMComponent implements AfterViewInit {
    @ViewChild('iframe') private _iframe: ElementRef;
    loading = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _creditService: CreditService,
        private _spReportService: SPReportService,
        private _datePipe: DatePipe,
    ) {}

    async ngAfterViewInit() {
        this.loading = true;
        let data;
        const creditId = +this._activatedRoute.snapshot.params.id;
        
        try {
            data = await this._creditService.loanAgreement(creditId);
        }
        catch (e) {
            console.error(e);
            this.loading = false;
            return;
        }
        
        let members: any[];
        
        try {
            members = await this._spReportService.listeMembreGroupeByCredit(creditId);
        }
        catch (e) {
            console.error(e);
            this.loading = false;
            return;
        }

        // const pIndex = members.findIndex((i) => i.member_role === 'PRESIDENT');

        const sfdName = UserData.getInstance().getSFD().name;
        const montantEnLettre = toWords(data.montant);
        const montantDu = data.nominal + data.interet;
        const montantDuEnLettre = toWords(montantDu);
        let qrCode;

        try {
            qrCode = await qrGenerator().toDataURL(
                JSON.stringify({
                    type: 'SFD',
                    reference: UserData.getInstance().getSFD().code,
                }),
                {
                    errorCorrectionLevel: 'H',
                    type: 'image/jpeg',
                    rendererOpts: {
                        quality: 0.3
                    }
                }
                );
        }
        catch (e) {
            console.error(e);
        }

        this.loading = false;
                
        var dd = {
            content: [
                {
                    table:{
                    widths: ['*'],
                    body: [
                        [
                            
                            {
                                table:{
                                 widths: ['*'],
                                 body: [
                                        [
                                           {
                                               
                                               stack:[
                                                    {
                                                        table: {
                                                            widths: ['*'],
                                                            body: [
                                                                [
                                                                    {
                                                                        text: 'CONTRAT DE PRET',
                                                                        alignment: 'center',
                                                                        bold: true,
                                                                        fontSize: 18,
                                                                        margin: [0,5,0,0],
                                                                    }
                                                                ]
                                                            ]
                                                        },
                                                        margin: [100, 0, 100, 15],
                                                        lineHeight: 1.2,
                                                    },                                                    
                                                    {
                                                        text: 'ENTRE',
                                                        style: 'bold10',
                                                        margin:[0,0,0,0],
                                                        
                                                    },
                                                    {
                                                        text: sfdName + ', représentée par le Chef d\' Agence Mr(Mme) '+ data.nameCa + ' de l\' agence ' + data.nameAgence + ' sise à ' + data.adressAgence + ', Tel: ' + data.phoneAgence,
                                                        style: '_textStyle10',
                                                        margin:[0,0,0,0],
                                                    },
                                                    {
                                                        stack:[
                                                            {
                                                                text:[
                                                                    {
                                                                        text: 'ET ',
                                                                        bold: true,
                                                                    },
                                                                ]
                                                            },
                                                            {
                                                                text:[
                                                                    {
                                                                        text: data.president + ' Président(e) du Groupe ' + data.name + ' sis à ' + (data.quartier || '.......................') + ', dans la Commune de: ' + (data.commune || '.......................') + ' département de  ' + (data.departement || '.......................') + ' demeurant et domicilié(e) à ' + (data.domicile || '.......................') ,
                                                                        style: '_textStyle10'
                                                                    },
                                                                ]
                                                            },
                                                            
                                                        ],
                                                        margin:[0,5,0,10],
                                                    },
                                                    {
                                                        text: 'Il a été convenu et arrêté les clauses suivantes :',
                                                        style: 'textStyle'
                                                    },{
                                                        stack: [
                                                            {
                                                                text:[
                                                                    {
                                                                        text:'Article',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' 1 : ',
                                                                        style: 'textStyle'
                                                                    },
                                                                    {
                                                                        text:'OBJET',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' : '+ sfdName +'met à la disposition du groupement un crédit ' + montantEnLettre + ' (' + data.montant + ') Francs CFA.',
                                                                        style: 'textStyle'
                                                                    },
                                                                    
                                                                ],
                                                            }, 
                                                            {
                                                                text:[
                                                                    {
                                                                        text:'Article',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' 2 : ',
                                                                        style: 'textStyle'
                                                                    },
                                                                    {
                                                                        text:'MOTIF',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' : Le crédit est destiné à appuyer les bénéficiaires pour leurs activités génératrices de revenus.',
                                                                        style: 'textStyle'
                                                                    },
                                                                    
                                                                ],
                                                            },
                                                            {
                                                                text:[
                                                                    {
                                                                        text:'Article',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' 3 : ',
                                                                        style: 'textStyle'
                                                                    },
                                                                    {
                                                                        text:'DUREE',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' : La durée du crédit est de 6mois et prend effet pour compter de la date de déblocage du crédit numérique.',
                                                                        style: 'textStyle'
                                                                    },
                                                                    
                                                                ],
                                                            },
                                                            {
                                                                text:[
                                                                    {
                                                                        text:'Article',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' 4 : ',
                                                                        style: 'textStyle'
                                                                    },
                                                                    {
                                                                        text:'INTERÊT',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' : Le crédit est alloué au taux proportionnel constant de 8,5% sur les 6 mois.',
                                                                        style: 'textStyle'
                                                                    },
                                                                    
                                                                ],
                                                            },
                                                            {
                                                                text:[
                                                                    {
                                                                        text:'Article',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' 5 : ',
                                                                        style: 'textStyle'
                                                                    },
                                                                    {
                                                                        text:'GARANTIE',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' : la caution solidaire des membres du groupe représente la garantie du crédit.',
                                                                        style: 'textStyle'
                                                                    },
                                                                    
                                                                ],
                                                            },
                                                            {
                                                                text:[
                                                                    {
                                                                        text:'Article',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' 6 : ',
                                                                        style: 'textStyle'
                                                                    },
                                                                    {
                                                                        text:'REMBOURSEMENT DU CREDIT',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' : Le crédit est remboursé en six (6) mensualité égales. Le montant dû s’élève à ' + montantDuEnLettre + ' (' + montantDu + ') Francs CFA',
                                                                        style: 'textStyle'
                                                                    },
                                                                    
                                                                ],
                                                            },
                                                            {
                                                                text:[
                                                                    {
                                                                        text:'Article',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' 7 : ',
                                                                        style: 'textStyle'
                                                                    },
                                                                    {
                                                                        text:'DEBLOCAGE DE CREDIT',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' : Le crédit est débloqué en une seule fois par '+sfdName+' au profit des bénéficiaires du groupe en numérique.',
                                                                        style: 'textStyle'
                                                                    },
                                                                    
                                                                ],
                                                            },
                                                            {
                                                                text:[
                                                                    {
                                                                        text:'Article',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' 8 : ',
                                                                        style: 'textStyle'
                                                                    },
                                                                    {
                                                                        text:'INDIVIDUALITE ET SOLIDARITE',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' : La créance de '+ sfdName +'est indivisible et peut être réclamée en totalité des autres membres du groupe.',
                                                                        style: 'textStyle'
                                                                    },
                                                                    
                                                                ],
                                                            },
                                                            {
                                                                text:[
                                                                    {
                                                                        text:'Article',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' 9 : ',
                                                                        style: 'textStyle'
                                                                    },
                                                                    {
                                                                        text:'REGLEMENT DES LITIGES',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' : Les litiges qui naîtront du non respect des clauses du présent contrat devront faire l’objet de concertation entre les parties contractantes pour trouver une solution à l’amiable. En cas de non compréhension, les différends seront portés devant les instances légales et règlementaires en République du Bénin.',
                                                                        style: 'textStyle'
                                                                    },
                                                                    
                                                                ],
                                                            },
                                                            {
                                                                text:[
                                                                    {
                                                                        text:'Article',
                                                                        style: 'boldUnderline08'
                                                                    },
                                                                    {
                                                                        text: ' 10 ',
                                                                        style: 'textStyle'
                                                                    },
                                                                    {
                                                                        text: ' : Après avoir pris connaissance, les parties contractantes déclarent librement et en toute responsabilité signer le présent contrat.',
                                                                        style: 'textStyle'
                                                                    },
                                                                    
                                                                ],
                                                            },{
                                                                text: 'A                     Le '+ this._datePipe.transform(new Date(), 'mediumDate'),
                                                                alignment: 'right',
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        columns: [
                                                            {
                                                                table:{
                                                                    widths: ['*'],
                                                                    body: [
                                                                        [
                                                                            {
                                                                                columns: [
                                                                                {
                                                                                    stack:[
                                                                                        {
                                                                                            text:'Membres Groupes',
                                                                                            style: 'boldUnderline10'
                                                                                        },
                                                                                        ...members.map((i) => (
                                                                                            {
                                                                                                text: i.name + ' ' + i.first_name,
                                                                                                style: '_textStyle',
                                                                                                margin: [10,0,0,0]
                                                                                            }
                                                                                        )),
                                                                                    ]
                                                                                },
                                                                                {
                                                                                   stack:[
                                                                                        {
                                                                                            text:'Signatures',
                                                                                            style: 'boldUnderline10'
                                                                                        },
                                                                                        ...members.map((i) => (
                                                                                            {
                                                                                                text:'.......................',
                                                                                                style: '_textStyle',
                                                                                            }
                                                                                        )),
                                                                                        
                                                                                    ],margin: [10,0], width: 'auto',
                                                                                }
                                                                                ],
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                            },
                                                            {
                                                               text:[
                                                                    {
                                                                      
                                                                        text: 'Pour '+sfdName+'\nLe chef d\'agence',
                                                                        style: 'boldUnderline10',
                                                                        alignment: 'center',
                                                                    },{
                                                                        text:'\n\n\n'+data.nameCa, alignment: 'center',
                                                                    }   
                                                                ],
                                                                width: 'auto',
                                                                margin:[25, 0, 10,0]
                                                            },
                                                            
                                                        ],
                                                        margin:[0, 20, 0,0]
                                                    },
                                                   
                                                   ]
                                           }
                                        ]
                                    ]
                                },
                                layout: {
                                    hLineColor: function (i, node) {
                                        return  '#03355b';
                                    },
                                    vLineColor: function (i, node) {
                                        return '#03355b';
                                    },
                                    hLineWidth: function (i, node) {
                                        return 3;
                                    },
                                    vLineWidth: function (i, node) {
                                        return 3;
                                    },
                                    paddingLeft: function(i, node) { return 15; },
                                    paddingRight: function(i, node) { return 10; },
                                    paddingTop: function(i, node) { return 10; },
                                    paddingBottom: function(i, node) { return 10; }
                                },
                                margin: [-1, 0],
                                lineHeight: 1.8,
                                
                            }
                        ]
                    ]
                    },
                    layout: {
                        hLineColor: function (i, node) {
                            return'black';
                        },
                        vLineColor: function (i, node) {
                            return  'black';
                        },
                        hLineWidth: function (i, node) {
                            return 0.5;
                        },
                        vLineWidth: function (i, node) {
                            return 0.5;
                        },
                    },
                    margin: [-15, -15],
                    border: [true, true, true, true], 
                },
                
            ],
            styles: {
                textStyle: {
                    fontSize: 9,
                    alignment: 'justify',
                    italics: 'true'
                },
                _textStyle: {
                    fontSize: 9,
                    alignment: 'justify',
                },
                textStyle10: {
                    fontSize: 11,
                    alignment: 'justify',
                    italics: 'true'
                },
                _textStyle10: {
                    fontSize: 11,
                    alignment: 'justify',
                },
                italicStyle: {
                    fontSize: 11,
                    fontStyle: 'italic',
                    alignment: 'justify',
                },
                bold10: {
                    fontSize: 11,
                    bold: true
                },
                boldItalic10: {
                    fontSize: 11,
                    bolditalics: true
                },
                bold08: {
                    fontSize: 9,
                    bold: true
                },
                boldUnderline08: {
                    fontSize: 9,
                    bold: true,
                    decoration: 'underline',
                    decorationStyle: 'solid',
                    decorationColor: 'black'
                },
                boldUnderline10: {
                    fontSize: 11,
                    bold: true,
                    decoration: 'underline',
                    decorationStyle: 'solid',
                    decorationColor: 'black'
                },                
            }
            
        };

        var old = {

            content: [
                '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'CONTRAT DE PRET',
                                    alignment: 'center',
                                    bold: true,
                                    fontSize: 30,
                                    margin: [0, 5],
                                }
                            ]
                        ]
                    },
                    margin: [0, 0, 0, 15],
                    pageBreak: 'after',
                },
                {
                    columns: [
                        {
                            width: 'auto',
                            stack: [
                                {
                                    bold: true,
                                    text: 'TYPE DE CREDIT'
                                },
                                data.naturecredit + '\n\n\n',
                                {
                                    bold: true,
                                    text: 'LE PRETEUR'
                                },
                                sfdName + '\n\n\n',
                                {
                                    bold: true,
                                    text: 'L\' EMPRUNTEUR'
                                },
                                data.name + '\n\n\n',
                                {
                                    bold: true,
                                    text: 'LA CAUTION'
                                },
                                data.president + '\n\n\n',
                            ],
                        }, 
                        {
                            width: '*',
                            stack: [
                                {
                                    bold: true,
                                    text: 'ENTRE',
                                },
                                {
                                    text: [
                                        {
                                            text: data.president + ' Président(e) du Groupe ' + data.name + ' sis à ' + data.quartier + ', dans la Commune de: ' + data.commune + ' département de  ' + data.departement + ' demeurant et domicilié(e) à ' + data.domicile + '; Ci-après dénommée la ',
                                            alignment: 'justify'
                                        },
                                        {
                                            text: '"LA CAUTION"',
                                            bold: true,
                                        },
                                        ';\n\n'
                                    ]
                                },
                                {
                                    bold: true,
                                    text: 'D\' UNE PART,',
                                },
                                'ET\n\n',
                                {
                                    text: [
                                        {
                                            text: sfdName + ', représentée par le Chef d\' Agence Mr(Mme) '+ data.nameCa + ' de l\' agence ' + data.agenceName + ' sise à ' + data.adressAgence + ', Tel: ' + data.phoneAgence + ' ci-après dénommé ',
                                            alignment: 'justify',
                                        },
                                        {
                                            text: '"LE PRETEUR"',
                                            bold: true,
                                        },
                                        ';\n\n'
                                    ]
                                },
                                {
                                    bold: true,
                                    text: 'D\' AUTRE PART,',
                                },
                                '\nIL A ETE CONVENU CE QUI SUIT:\n\n',
                                    {
                                    bold: true,
                                    text: 'EXPOSE DES MOTIFS',
                                },
                                {
                                    alignment: 'justify',
                                    text: 'Pour participer au développement des couches les plus pauvres de notre société, ' + sfdName + ' a noué un partenariat avec le Fonds National de la Microfinance afin d\' exécuter le programme du Micro crédit Mobile\nAu titre de ce partenariat, ' + sfdName + ' a reçu un fonds d\' exécution en phase pilote afin de financer les différents groupes solidaires éligibles. Ainsi, pour assurer la garantie et le recouvrement ponctuel et intégral desdits fonds, le Groupe ' + data.name + 'se porte caution solidaire et indivisible de tous engagements pour un montant de ' + montantEnLettre + ' (' + data.montant + ') Francs CFA au profit du Groupe ' + data.name + '\nLa présente convention de cautionnement s’articule autour des dispositions ci-après:',
                                },
                            ],
                        }
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 1: Engagement de la caution,',
                        },
                        'Mme/Mr ' + data.president + ', déclare par les présentes se constituer CAUTION du Groupe ' + data.name + ' à raison de toutes les sommes qui peuvent ou pourront être dues à la Microfinance par le Groupe '+ data.name + ', pour quelque cause que ce soit à concurrence de la somme de ' + montantEnLettre + ' (' + data.montant + ');'
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 2 : Obligation de la caution',
                        },
                        'En raison du caractère solidaire du présent cautionnement la Caution renonce au bénéfice de discussion et de division. ' + sfdName + '. pourra donc exiger de Mme/Mr ' + data.president + ' le remboursement immédiat de la totalité des sommes dues par du Groupe ' + data.name + ' cautionné(e) sans avoir à engager de poursuites à l’encontre de ce dernier.'
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 3 :Exigibilité',
                        },
                        'Toutefois, Mme/Mr ' + data.president + ' ne peut être poursuivi(e) qu’après mise en demeure infructueuse de Mr/Mme ' + data.name + '. Cependant celui-ci sera appelé à la cause entre ' + sfdName + ' et le Groupe ' + data.name + '.\n' + sfdName + ' pourra toujours rendre le présent cautionnement exigible en cas d’inexécution par le Groupe ' + data.name + ' de ses obligations pour quelque cause que ce soit.\nMme/Mr ' + data.president + 'sera alors tenu(e) d’exécuter et de payer à ' + sfdName + ', à sa demande, le montant intégral des sommes dues sans pouvoir se prévaloir du maintien du terme, des remises ou délais qui pourraient profiter au Groupe ' + data.name + ' notamment dans le cadre d’une dissolution. Sauf décision contraire de ' + sfdName + ', toutes sommes dues à la Microfinance en principal, intérêt, commissions, frais et accessoires au titre des crédits cautionnés deviendront immédiatement exigibles dès réception par Mr/Mme ' + data.president + ', de la visite d’un agent de recouvrement ou d’une lettre recommandée avec accusé de réception ou par exploit d’huissier.'
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 4 : Preuve des créances',
                        },
                        'La preuve de l’existence des créances résultera notamment de la fiche de décaissement du Groupe ' + data.name + ' , du dossier de crédit et même des divers actes ou les écritures figurant sur ses registres de crédits et ou ses livres comptables qui seront réputés avoir valeur de titres de créances.\nLa preuve de l’existence des créances résultera notamment de la fiche de décaissement. Mr/Mme ' + data.president + ' reconnaît que le présent acte constitutif du dossier de crédit et de l’obligation principale, est annexé à la convention de prêt et du nantissement de stock.\n' + sfdName + ' déclare connaître la situation financière et juridique du débiteur à la date de signature des présentes.'
                    ],
                },
                {
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 5 : Révocation du cautionnement',
                        },
                        'Le présent engagement de cautionnement reste en vigueur tant que le Groupe ' + data.name + ' débiteur principal, restera devoir une quelconque somme à ' + sfdName + '. et ce jusqu’à révocation par la caution.\nCe cautionnement sera valable jusqu’à révocation dûment signifiée dans les formes ci-après indiquées : cette révocation n’en portera décharge de que par le paiement dans les limites ci-dessus de toutes les sommes que le Groupe ' + data.name + ' pourra devoir à ' + sfdName + ' en raison du contrat ou des engagements y compris les cautions délivrées par ' + sfdName + ' et les engagements directs ou indirects dont l’origine sera antérieure à la date à laquelle prendra effet ladite révocation et notamment le reliquat de tous comptes crédits arrêtés de plein droit à cette date et de tous engagements en cours. Cette révocation devra s’effectuer par une lettre recommandée avec accusé de réception à ' + sfdName + ' pour lui faire part de sa décision de révoquer le présent engagement.'
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 6 : Effet de la révocation',
                        },
                        'La révocation prendra effet dès réception de la lettre de révocation; les obligations de la caution de  Mr/Mme ' + data.president + ', ne seront déterminées qu’à terme sans pouvoir excéder le montant de la position débitrice lors de la révocation mais en tenant compte de la liquidation des opérations en cours à cette date et dénouées ultérieurement.\nSi, en raison de cette révocation, ' + sfdName + ' décidait de réduire ou d’ interrompre les concours consentis au Groupe ' + data.name + ' et d’en demander le remboursement, elle devra respecter un délai de préavis.\nLa caution Mr/Mme ' + data.president + ' , resterait alors tenue, dans les limites de son engagement, des obligations contractées par le débiteur,le Groupe ' + data.name + ' postérieurement à la révocation et jusqu’à l’expiration de la période de préavis, à charge pour ' + sfdName + ' de notifier au Groupe ' + data.name + ', sa décision dans les trente (30) jours qui suivront la réception de la lettre de révocation.'
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 7 : Concours de garanties',
                        },
                        {
                            ul: [
                                'L’épargne stratégique constitué par les membres du Groupe ' + data.name + '  ne sera restitué que si la bénéficiaire, la caution et l’ensemble des autres bénéficiaires de la commune de ne sont pas défaillants à l’échéance ;',
                                'Garantie résultant du présent acte n’affecte et ne pourra affecter la nature et l’étendue de tous engagements et toutes garanties, réels, ou personnels, qui ont pu ou pourront être contractés ou fournis en faveur de ' + sfdName + ', soit par  le Groupe ' + data.name + ' , soit par  Mr/Mme ' + data.president + ', soit par tout tiers, le montant de la présente caution s’ajoutant au contraire auxdits engagements et garanties.'
                            ]
                        },
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 8 : Frais et accessoires',
                        },
                        'Tous les frais de justice et de contentieux ou d’actes d’huissier qu’ engendrerait le non respect des engagements pris par la caution lui seront imputés.'
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 9 : Election de domicile',
                        },
                        'Pour l’exécution des présentes et leurs suites et notamment pour la validité de tout envoi postal ou de toute notification qui s’avérait nécessaire, fait élection de domicile à l’adresse ci-dessous indiquée:'
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 9 : Election de domicile',
                        },
                        'Pour l’exécution des présentes et leurs suites et notamment pour la validité de tout envoi postal ou de toute notification qui s’avérait nécessaire, fait élection de domicile à l’adresse ci-dessous indiquée:'
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 10 : Attribution de juridiction',
                        },
                        'Le Prêteur et la caution s’engagent à régler à l’amiable, tout différend pouvant naître de la mise en application du présent acte;\nEn cas d’échec, les juridictions béninoises compétentes seront habilitées à connaître du litige.'
                    ],
                },
                {
                    alignment: 'justify',
                    stack: [
                        {
                            bold: true,
                            text: '\nArticle 11 : Entrée en vigueur',
                        },
                        'Le présent acte de cautionnement solidaire et indivisible entre en vigueur dès sa signature.'
                    ],
                },
                '\n\n',
                {
                    text: 'Membres du groupe ' + data.name,
                    // fontSize: 16,
                    bold: true,
                    margin: [0, 0, 0, 10],
                },
                {
                    table: {
                        body: [
                            [
                                {
                                    text: 'Nom & Prénom(s)',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Rôle',
                                    style: 'tableHeader',
                                },
                            ],
                            ...members.map((i) => ([
                                {
                                    text: i.name + ' ' + i.first_name,
                                },
                                {
                                    text: i.member_role,
                                },
                            ])),
                        ]
                    },
                    layout: {
                        hLineWidth: () => 0,
                        vLineWidth: (i, node) => i == 0 || i == node.table.widths.length ? 0 : 1,
                        vLineColor: () => '#fff',
                        fillColor: (i) => {
                            if (i == 0) {
                                return 'blue';
                            }

                            return (i % 2 === 0) ? '#afced7' : null;
                        }
                    },
                },
                '\n\nFait en deux Exemplaires Originaux à ......................................................, le ' + this._datePipe.transform(new Date(), 'mediumDate'),
                '\n\n\n\n\n',
                {
                    columns: [
                        {
                            width: 'auto',
                            text: 'Pour ' + sfdName,
                        },
                        {
                            width: '*',
                            alignment: 'center',
                            stack: [
                                (() => qrCode ? {image: qrCode, width: 100} : {text: ''})()
                            ],
                        },
                        {
                            width: 'auto',
                            text: 'L\' Emprunteur(Lu et approuvé)\n' + data.name,
                        },
                    ],
                },
            ],
            styles: {
                tableHeader: {
                    background: "blue",
                    color: "white",
                    bold: true,
                    border: [true, true, true, true]
                },
            },
            defaultStyle: {
                columnGap: 20,
            },
            footer: function (currentPage, pageCount) {
                return {
                    //margin: [100, -50, 20, 180],
                    margin: [40, 0, -50, 0],
                    text: currentPage + ' / ' + pageCount
                }
                
            }
        };
        
        pdfMake.createPdf(dd)
        .getDataUrl((data) => {
            this._iframe.nativeElement.src = data;
        });
    }
}