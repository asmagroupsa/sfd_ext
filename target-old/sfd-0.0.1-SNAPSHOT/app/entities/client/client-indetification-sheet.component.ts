import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Client, ClientService } from '.';
import { createRequestOption, UserData, READFILEURL, READBITFILEURL } from '../../shared';
import { ImageService } from '../../shared/image.service';
import { getImgSrc } from '../../shared/model/functions';
import { StateService } from '../../shared/state/statistiques';
import { Agence, AgenceService } from '../agence';

declare const jQuery: any;
declare const jsPDF: any;
declare let pdfMake: any;

@Component({
    selector: 'jhi-client-indentification-sheet',
    templateUrl: './client-indentification-sheet.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class ClientIndetificationSheetComponent implements OnInit, OnDestroy {
    private imageUrl = READFILEURL;
    private _subscription: Subscription;
    private _ficheLoadEnd: boolean;
    private _clientLoadEnd: boolean;
    private _agenceLoadEnd: boolean;
    public client: Client;
    public agence: Agence;
    public fiche: any[];
    private increment: number = 0;
    private imageReady: boolean;
    _DePage: any;
    // private printZone: ElementRef;

    @ViewChild('printZone') printZone: ElementRef;

    // @ViewChild('printZone') printZone: ElementRef;
    constructor(
        private _clientService: ClientService,
        private _activatedRoute: ActivatedRoute,
        private _stateService: StateService,
        private _agenceService: AgenceService,
        private _datePipe: DatePipe,
        private http: Http,
        private _changeDetectorRef: ChangeDetectorRef,
        private imageService: ImageService
    ) {
        this.client = null;
        this.agence = null;
        this.fiche = [];
        this._ficheLoadEnd = false;
        this._clientLoadEnd = false;
        this._agenceLoadEnd = false;

        // this.hostElement.nativeElement.querySelector("#print");
    }




    public printAsPdf(printArea): void {
        window.frames["print_frame"].print();
    }



    get hideLoader(): boolean {
        let tmp = this._clientLoadEnd && this._ficheLoadEnd;
        return tmp;
    }

    getImgSrc(url: string): string {
        return getImgSrc(url);
    }

    private _getIdentificationSheet(clientId: number): void {
        this._clientService.indetificationSheet(clientId)
            .subscribe(
                ((fiche: any) => {
                    this.fiche = fiche;
                    if (this.fiche['picture_url']) {
                        /* this.fiche['picture_url'] = this.getImgSrc(this.fiche['picture_url']); */
                        this.imageReady = true;
                        /*  this._imageService.getImageData(this.fiche['picture_url'])
                         .then((dataUrl) => {
                             this.fiche['picture_url'] = dataUrl;
                             this.imageReady=true;
                         })
                         .catch((err)=> {
                             this.fiche['picture_url'] = '../../../content/images/avatar.png'
                             this.imageReady = true;
                         }) */
                    } else {
                        /* this.fiche['picture_url'] = '../../../content/images/avatar.png' */
                        this.imageReady = true;
                    }
                    this._ficheLoadEnd = true;
                    this._getClient(clientId);
                })
            );
    }

    private _getClient(clientId: number): void {
        this._clientService.find(clientId)
            .subscribe(
                ((client: any) => {
                    this.client = client;
                    this._clientLoadEnd = true;
                    this._buildFiche();
                    this._getAgence(client.agenceId);
                })
            );
    }

    private _getAgence(agenceId: number): void {
        this._agenceService.find(agenceId).subscribe(
            ((agence: any) => {
                this.agence = agence;
                this._agenceLoadEnd = true;
            })
        );
    }

    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this._subscription = this._activatedRoute.params.subscribe((params: any[]) => {
            const clientId: number = parseInt(params['id'], 10);
            this._getIdentificationSheet(clientId);
        });
    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    public isSection(id: number): boolean {
        return [1, 13, 20, 29].indexOf(id) > -1;
    }

    public print(): void {
        const pdf: any = new jsPDF();
        // this._stateService.save('#indentification-sheet', `client-${this.client.id}-indentification-sheet`);
    }
    async _buildFiche() {
        try {
            let dd = await this._buildData(this.fiche);
            //let name: string = client.name.replace(/ /g, '');
            console.log(Object.assign({}, dd));
            let pdf = pdfMake.createPdf(dd);
            //pdf.download(`releve-${name}.pdf`);
            pdf.getDataUrl((data) => {
                if (data) {
                    this.printZone.nativeElement.src = data;
                }
            });
        } catch (error) {

        }
    }
    onLoadedPhoto(url: string) {
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');
        return this.http
            .get(`${READBITFILEURL}${url}`, options)
            .map((response: any) => {
                return 'data:image/png;base64,' + response._body;
            }).toPromise();
    }
    private async _buildData(fiche) {
        let picture;
        try {
            picture = await this.onLoadedPhoto(fiche['picture_url']);
        } catch (error) {

        }

        return {
            content: [
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [{
                                width: '*',
                                text: "FICHE D'IDENTIFICATION",
                                alignment: 'center',
                                style: 'title'
                            }]
                        ]
                    },
                    layout: {
                        fillColor: function (i, node) {
                            return '#afced7';
                        }
                    }
                },
                {
                    style: 'subTable',
                    table: {
                        widths: ['*', 'auto'],
                        body: [
                            [{
                                text: "Information sur le client",
                                style: 'subTitle',
                                width: '*'
                            }, picture ? {
                                width: 60,
                                height: 60,
                                image: picture,
                                alignment: 'right',
                                style: 'image'
                            } : '']
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return i == 0 || i == node.table.widths.length ? 1 : 0;
                        },
                        hLineColor: function (i, node) {
                            return 'gray';
                        },
                        vLineColor: function (i, node) {
                            return 'gray';
                        }
                    }
                },
                {
                    style: "table",
                    alignment: 'justify',
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [{
                                width: '*',
                                columns: [
                                    {
                                        text: "Nom du client",
                                        width: '*',
                                        style: 'label'
                                    },
                                    {
                                        text: fiche.nomduclient?`${fiche.nomduclient}`.toUpperCase():'',
                                        width: 'auto',
                                        alignment: 'right',
                                        style: ['value','name']
                                    }
                                ]
                            },
                            {
                                columns: [
                                    {
                                        text: "Prénoms:",
                                        width: '*',
                                        style: 'label'
                                    },
                                    {
                                        text: fiche.prenomsduclient || '--',
                                        width: 'auto',
                                        alignment: 'right',
                                        style: ['value','name']
                                    }
                                ]
                            }],
                            [
                                {
                                    columns: [
                                        {
                                            text: "Date de naissance",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.datedenaissance?`${this._datePipe.transform(fiche.datedenaissance, 'mediumDate')}`:'--',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value',
                                            italics:true
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: "Lieu de Naissance:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.lieudenaissance || '--',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: "Sexe",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text:fiche.sexe || '--',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: "Ville:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text:fiche.ville || '--',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: "Tél",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.tel || '--',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value',
                                            italics:true
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: "N. CNI:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.ncnipassport || '--',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: "RAVIP",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.ravip || '--',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                                ,
                                {
                                    columns: [
                                        {
                                            text: "Adresse:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.adresseBP || '--',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ],
                            /* [
                                {
                                    columns: [
                                        {
                                            text: "N° Passport",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.numpassport || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: "LEPI:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.lepi || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ], */
                            /* [
                                {
                                    columns: [
                                        {
                                            text: "Situation Mat",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.situationMat || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                                ,
                                {
                                    columns: [
                                        {
                                            text: "Permis:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.permis || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ] */
                        ]
                    },
                    layout: {
                        fillColor: function (i, node) {
                            //if (i == 0) return 'blue';
                            return (i % 2 === 0) ? '#f5f5f5' : null;
                        },
                        hLineWidth: function (i, node) {
                            return 0.5;
                        },
                        vLineWidth: function (i, node) {
                            return 0.5;
                        }
                    }
                }
                , {
                    style: 'subTable',
                    table: {
                        widths: ['*', 'auto'],
                        body: [
                            [{
                                text: "Information sur le(la) conjointe",
                                style: 'subTitle',
                                width: '*'
                            }, {
                                text: '',
                                alignment: 'right'
                            }]
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return i == 0 || i == node.table.widths.length ? 1 : 0;
                        },
                        hLineColor: function (i, node) {
                            return 'gray';
                        },
                        vLineColor: function (i, node) {
                            return 'gray';
                        },
                    }
                },
                {
                    style: "table",
                    alignment: 'justify',
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [{
                                width: '*',
                                columns: [
                                    {
                                        text: "Nom du conjoint(e)",
                                        width: '*',
                                        style: 'label'
                                    },
                                    {
                                        text: fiche.nomconjoint || '',
                                        width: 'auto',
                                        alignment: 'right',
                                        style: 'value'
                                    }
                                ]
                            },
                            {
                                columns: [
                                    {
                                        text: "Prénoms:",
                                        width: '*',
                                        style: 'label'
                                    },
                                    {
                                        text: fiche.prenomsconjoint || '',
                                        width: 'auto',
                                        alignment: 'right',
                                        style: 'value'
                                    }
                                ]
                            }],
                            [
                                {
                                    columns: [
                                        {
                                            text: "Profession",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.profession || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: "Num tél:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.ntel || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ],
                        ]
                    },
                    layout: {
                        fillColor: function (i, node) {
                            //if (i == 0) return 'blue';
                            return (i % 2 === 0) ? '#f5f5f5' : null;
                        }
                    }
                },
                {
                    style: 'subTable',
                    table: {
                        widths: ['*', 'auto'],
                        body: [
                            [{
                                text: "Information sur l'entreprise",
                                style: 'subTitle',
                                width: '*'
                            }, {
                                text: '',
                                alignment: 'right'
                            }]
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return i == 0 || i == node.table.widths.length ? 1 : 0;
                        },
                        hLineColor: function (i, node) {
                            return 'gray';
                        },
                        vLineColor: function (i, node) {
                            return 'gray';
                        },
                        // paddingLeft: function(i, node) { return 4; },
                        // paddingRight: function(i, node) { return 4; },
                        // paddingTop: function(i, node) { return 2; },
                        // paddingBottom: function(i, node) { return 2; },
                        // fillColor: function (i, node) { return null; }
                    }
                },
                {
                    style: "table",
                    alignment: 'justify',
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [{
                                width: '*',
                                columns: [
                                    {
                                        text: "Raison social",
                                        width: '*',
                                        style: 'label'
                                    },
                                    {
                                        text: fiche.raisonsocial || '',
                                        width: 'auto',
                                        alignment: 'right',
                                        style: 'value'
                                    }
                                ]
                            },
                            {
                                columns: [
                                    {
                                        text: "Adresse du siège:",
                                        width: '*',
                                        style: 'label'
                                    },
                                    {
                                        text: fiche.adresse_siège || '',
                                        width: 'auto',
                                        alignment: 'right',
                                        style: 'value'
                                    }
                                ]
                            }],
                            [
                                {
                                    columns: [
                                        {
                                            text: "Lieu d'établissement",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.lieudetablissement || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: "Titre:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.titre || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: "Num RCCM",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.nrccm || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: "Banque:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: `${fiche.banque}${fiche.ndecomptebancaire ? '' + fiche.ndecomptebancaire + '' : ''}`,
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    layout: {
                        fillColor: function (i, node) {
                            //if (i == 0) return 'blue';
                            return (i % 2 === 0) ? '#f5f5f5' : null;
                        }
                    }
                },
                {
                    style: 'subTable',
                    table: {
                        widths: ['*', 'auto'],
                        body: [
                            [{
                                text: "Cautionnement Solidaire",
                                style: 'subTitle',
                                width: '*'
                            }, {
                                text: '',
                                alignment: 'right'
                            }]
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return i == 0 || i == node.table.widths.length ? 1 : 0;
                        },
                        hLineColor: function (i, node) {
                            return 'gray';
                        },
                        vLineColor: function (i, node) {
                            return 'gray';
                        },
                        // paddingLeft: function(i, node) { return 4; },
                        // paddingRight: function(i, node) { return 4; },
                        // paddingTop: function(i, node) { return 2; },
                        // paddingBottom: function(i, node) { return 2; },
                        // fillColor: function (i, node) { return null; }
                    }
                },
                {
                    style: "table",
                    alignment: 'justify',
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [{
                                width: '*',
                                columns: [
                                    {
                                        text: "Nom Caution",
                                        width: '*',
                                        style: 'label'
                                    },
                                    {
                                        text: fiche.nomcaution || '',
                                        width: 'auto',
                                        alignment: 'right',
                                        style: 'value'
                                    }
                                ]
                            },
                            {
                                columns: [
                                    {
                                        text: "Titre Caution:",
                                        width: '*',
                                        style: 'label'
                                    },
                                    {
                                        text: fiche.titrecaution || '',
                                        width: 'auto',
                                        alignment: 'right',
                                        style: 'value'
                                    }
                                ]
                            }],
                            [
                                {
                                    columns: [
                                        {
                                            text: "Num RCCM Caution",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.nrccmcaution || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: "Raison Sociale:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.raisonsocialcaution || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: "Adresse Siège ",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.adressesiege || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: "Adresse succursal:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.adressesuccursal || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: "Valeur de la Boutique ",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.valeurdelaboutique || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                },
                                {
                                    columns: [
                                        {
                                            text: "Articles vendus:",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.articlesvendus || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: "Valeur totale des marchandises ",
                                            width: '*',
                                            style: 'label'
                                        },
                                        {
                                            text: fiche.valeurtotaledesmarchandises || '',
                                            width: 'auto',
                                            alignment: 'right',
                                            style: 'value'
                                        }
                                    ]
                                },
                                ""
                            ]
                        ]
                    },
                    layout: {
                        fillColor: function (i, node) {
                            //if (i == 0) return 'blue';
                            return (i % 2 === 0) ? '#f5f5f5' : null;
                        }
                    }
                }
            ],
            styles: {
                name:{
                    bold:true
                },
                image: {
                    padding: [5, 5, 5, 5],
                    alignment: 'center',
                    border: [true, true, true, true],
                    margin: [2, 3, 3, 3]
                },
                title: {
                    fontSize: 22,
                    bold: true,
                    margin: [4, 8, 4, 8],
                },
                subTitle: {
                    fontSize: 18,
                    bold: true,
                    padding: [3, 3, 0, 3]
                },
                table: {
                    margin: [0, 8, 0, 5],
                    fontSize: 14
                },
                label: {
                    fontSize: 11,
                    margin: [2, 5, 0, 5]
                },
                value: {
                    fontSize: 13,
                    margin: [0, 5, 2, 5]
                },
                subTable: {
                    margin: [0, 10, 0, 5],
                    padding: [0, 3, 0, 3]
                }
            }
        }
    }
}
