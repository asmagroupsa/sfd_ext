import {Component, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SPClientService} from "../../shared/sp-client.service";
import {CreditComityService} from "./credit-comity.service";
import {CurrencyPipe, DatePipe} from "@angular/common";
import { numberWithSpaces } from '../../shared';

declare const pdfMake;
declare const toWords;

@Component({
    selector: 'jhi-pv-pre-comite',
    templateUrl: './pv-pre-comite.component.html',
})
export class PVPreComiteComponent implements AfterViewInit {
    @ViewChild('iframe') private _iframe: ElementRef;
    loading = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _creditComityService: CreditComityService,
        private _spClientService: SPClientService,
        private _currencyPipe: CurrencyPipe,
        private _datePipe: DatePipe,
    ) {}

    async ngAfterViewInit() {
        const id = +this._activatedRoute.snapshot.params.id;
        let comity;
        let dossiers;
        let synthesis;

        try {
            this.loading = true;
            comity = await this._creditComityService.find(id).toPromise();
            dossiers = await this._creditComityService.showDossierComityPV(id).toPromise();
            synthesis = await this._spClientService.syntheseCreditComity(id).toPromise();
        } catch (e) {
            console.log(e);
            this.loading = false;
            return;
        }

        this.loading = false;
        const pdf = pdfMake.createPdf(this._buildPdfDoc(comity, dossiers, synthesis, this._currencyFormatFn.bind(this)));
        pdf.getDataUrl((data) => {
            this._iframe.nativeElement.src = data;
        });
    }

    private _buildPdfDoc(comity, dossiers: any[], synthesis, currencyFormatFn) {
        let num = 0;
        const total = {
            amount_solicited: 0,
            amount_proposed: 0,
            amount_accorder: 0,
            nbr_membre: 0,
        };
        let i = 0;
        const members = ((members) => {
           //console.log(members);
            const roles = ['PRESIDENT', 'VICE_PRESIDENT', 'SECRETAIRE'];
            let members1 = members.filter((m) => roles.indexOf(m.roleDelegatedMember.code) === -1);
            let members2 = members.filter((m) => roles.indexOf(m.roleDelegatedMember.code) !== -1);
            let members3 = [];

            for (const r of roles) {
                const _members = members2.filter((m) => m.roleDelegatedMember.code === r);
                members3.push(..._members);
            }
            
            members3.push(...members1);
            return members3;
        })(comity.delegationComity.delegatedMembers);

        return {
            pageOrientation: 'landscape',
            pageSize: 'A4',
            content: [
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'PROCES-VERBAL DE PRÉ COMITÉ DE CRÉDIT',
                                    alignment: 'center',
                                    bold: true,
                                    fontSize: 20,
                                    margin: [0, 5],
                                }
                            ]
                        ]
                    },
                    margin: [0, 0, 0, 15],
                },
                {
                    text: `A la date du ${this._datePipe.transform(comity.startDate, 'mediumDate')} s 'est tenue la réunion du comité de crédit des dossiers pour le compte de l 'agence de ${comity.agences[0].name}. Etaient présent à cette réunion :`,
                },
                '\n',
                {
                    stack: members.map((member) => ({
                        text: `${member.roleDelegatedMember.name}: ${member.comityMber.user}`,
                        bold: true,
                    }))
                },
                '\n',
                {
                    text: 'Les dossiers présentés au comités sont:'
                },
                '\n',
                {
                    table: {
                        //widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*', '*', '*'],
                        body: [
                            [
                                {
                                    text: 'N°',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Référence',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Client (Réf)',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Nbr. membre',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Activité',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Contact',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Localité',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Mnt. sollicité',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Mnt. proposé',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Mnt. accordé',
                                    style: 'tableHeader',
                                },
                            ],
                            ...dossiers.map((dossier) => {
                                dossier.nbr_membre = dossier.nbr_membre || 1;
                                num++;
                                total.amount_accorder += dossier.amount_accorder;
                                total.amount_proposed += dossier.amount_proposed;
                                total.amount_solicited += dossier.amount_solicited;
                                total.nbr_membre += dossier.nbr_membre;

                                return [
                                    num,
                                    dossier.reference,
                                    dossier.nomprenom + ' (' + dossier.code_client + ')',
                                    {
                                        text: dossier.nbr_membre,
                                        alignment: 'right',
                                    },
                                    dossier.activite,
                                    dossier.contact,
                                    dossier.localite,
                                    {
                                        text: currencyFormatFn(dossier.amount_solicited),
                                        alignment: 'right',
                                    },
                                    {
                                        text: currencyFormatFn(dossier.amount_proposed),
                                        alignment: 'right',
                                    },
                                    {
                                        text: currencyFormatFn(dossier.amount_accorder),
                                        alignment: 'right',
                                    },
                                ];
                            }),
                            [
                                {
                                    text: 'Total',
                                    style: 'tableHeader',
                                    colSpan: 3,
                                    alignment: 'center',
                                },
                                {},
                                {},
                                {
                                    text: total.nbr_membre,
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                                {
                                    text: '',
                                    style: 'tableHeader',
                                    colSpan: 3,
                                },
                                {},
                                {},
                                {
                                    text: currencyFormatFn(total.amount_solicited),
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                                {
                                    text: currencyFormatFn(total.amount_proposed),
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                                {
                                    text: currencyFormatFn(total.amount_accorder),
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth: () => 0,
                        vLineWidth: (i, node) => (i == 0 || i == node.table.widths.length ? 0 : 1),
                        vLineColor: () => '#fff',
                        fillColor: (i) => {
                            if (i == 0) return 'blue';
                            return (i % 2 === 0) ? '#afced7' : null;
                        }
                    },
                },
                '\n',
                {
                    text: [
                        `Après les différents avis des membres, le comité a donc approuvé ${toWords(dossiers.length)}(${dossiers.length}) dossier${dossiers.length > 1 ? 's' : ''} pour un montant total de `,
                        {
                            text: `${toWords(synthesis.montant_total_comity)}(${currencyFormatFn(synthesis.montant_total_comity)} FCFA)`,
                            bold: true
                        },
                    ],
                },
                {
                    text: `Nombre de bénéficiares : ${synthesis.nbr_total_beneficiaire}`,
                    bold: true,
                },
                '\n\n',
                {
                    columns: [
                        {
                            width: '*',
                            text: 'Ont signé:',
                            alignment: 'center',
                            bold: true,
                        }
                    ],
                },
                '\n',
                {
                    columns: members.map((member) => ({
                        width: '*',
                            stack: [
                                {
                                    text: '- ' + member.roleDelegatedMember.name,
                                },
                                '\n\n\n',
                                {
                                    text: member.comityMber.user,
                                    bold: true,
                                },
                            ],
                            alignment: 'center',
                    })),
                },
            ],
            footer: function (currentPage, pageCount) {
                    return {
                        //margin: [100, -50, 20, 180],
                        margin: [40, 0, 75, 0],
                        alignment: 'right',
                        text: currentPage + ' / ' + pageCount,
                        
                    }
                    
            } ,
            styles: {
                /* tableStyle: {
                    fontSize: 9,
                }, */
                tableHeader: {
                    color: '#fff',
                    fillColor: 'blue',
                },
            },
            defaultStyle: {
                fontSize: 11,
            },
        };
    }

    private _currencyFormatFn(amount) {
        return numberWithSpaces(amount);
    }

}
