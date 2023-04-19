import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Client, ClientService } from '.';
import { createRequestOption, READFILEURL, ResponseWrapper, UserData } from '../../shared';
import { ImageService } from '../../shared/image.service';
import { getImgSrc } from '../../shared/model/functions';
import { HOST, READBITFILEURL } from '../../shared/model/request-util';
import { StateService } from '../../shared/state/statistiques';
import { Agence, AgenceService } from '../agence';
import { ProduitService } from '../produit';

declare let pdfMake: any;
declare const select_init: any;
@Component({
    selector: 'jhi-client-condition-acces-sheet',
    templateUrl: './client-condition-acces-sheet.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class ClientConditionAccesSheetComponent implements OnInit, OnDestroy {
    private imageUrl = READFILEURL;
    private _subscription: Subscription;
    private _ficheLoadEnd: boolean;
    private _clientLoadEnd: boolean;
    private _agenceLoadEnd: boolean;
    public client: Client;
    public agence: Agence;
    public fiche: any;
    private increment: number = 0;
    private imageReady: boolean;
    _DePage: any;
    produits: any[] = [];
    produit: any;

    @ViewChild('printZone') printZone: ElementRef;

    constructor(
        private _clientService: ClientService,
        private _activatedRoute: ActivatedRoute,
        private _stateService: StateService,
        private _agenceService: AgenceService,
        private _datePipe: DatePipe,
        private http: Http,
        private produitService: ProduitService,
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
    onProduitChange() {
        this._subscription = this._activatedRoute.params.subscribe((params: any[]) => {
            const clientId: number = parseInt(params['id'], 10);
            this._getIdentificationSheet(clientId);
        });
    }
    get hideLoader(): boolean {
        let tmp = this._clientLoadEnd && this._ficheLoadEnd;
        return tmp;
    }

    getImgSrc(url: string): string {
        return getImgSrc(url);
    }

    private _getIdentificationSheet(clientId: number): void {
        this._clientService.conditionAccesSheet(clientId, this.produit)
            .subscribe(
                ((fiche: any) => {
                    this.fiche = fiche;
                    this.fiche = this.fiche.sort((a, b) => {
                        return a.produit.localeCompare(b.produit) && a.condition.localeCompare(b.condition);
                    });
                    /*  if (this.fiche['picture_url']) {
                         this.imageReady = true;
                     } else {
                         this.imageReady = true;
                     } */
                    this._ficheLoadEnd = true;
                    this._getClient(clientId);
                })
            );
    }

    private _getClient(clientId: number): void {
        if (this._clientLoadEnd) {
            this.getConditionPDF(clientId);
            //this._buildFiche();
            return;
        }
        this._clientService.find(clientId)
            .subscribe(
                ((client: any) => {
                    this.client = client;
                    this._clientLoadEnd = true;
                    this.getConditionPDF(clientId);
                    //this._buildFiche();
                })
            );
    }
    getConditionPDF(clientId) {
        let agence = UserData.getInstance().currentAgence || UserData.getInstance().agence;
        let agence_name = agence?agence.name:'',
            agence_phone = agence?agence.phone:'',
            client_code = this.client.code,
            client_name = this.client.name,
            client_firstname = this.client.firstName,
            client_phone = this.client.phone,
            client_photo = this.client.pictureUrl;
        this._clientService.conditionAccesSheetPdf(clientId, UserData.getInstance().sfd_.name, agence_name, agence_phone, client_code, client_name, client_firstname, client_phone, client_photo, this.produit).subscribe(
            (res: any) => {
                console.log(res);
                this.fiche = res._body;
                this._ficheLoadEnd = true;
                this._clientLoadEnd = true;
                console.log(this.fiche);
                var reader = new FileReader();
                reader.addEventListener('load', () => {
                    this.printZone.nativeElement.src = reader.result;
                });
                reader.readAsDataURL(this.fiche);
                /* this.printZone.nativeElement.src = window.URL.createObjectURL(); */
                //this._buildFiche();
            },
            (res: ResponseWrapper) => {
                //this.onError(res.json);
            }
        );
    }
    ngAfterViewInit() {
        select_init();
    }
    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this._subscription = this._activatedRoute.params.subscribe((params: any[]) => {
            const clientId: number = parseInt(params['id'], 10);
            this._getIdentificationSheet(clientId);
        });
        this.produitService.getFnmAndSfdProduits({ NO_QUERY: true }, ['CREDIT', 'LIGNE_PRODUIT', 'LIGNE_CREDIT']).then((produits) => {
            this.produits = produits;
        })
            .catch((err) => {
                this.produits = [];
            });
    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    public isSection(id: number): boolean {
        return [1, 13, 20, 29].indexOf(id) > -1;
    }
    async _buildFiche() {
        try {
            let dd = await this._buildData(this.fiche);
            let pdf = pdfMake.createPdf(dd);
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
            if (this.client['pictureUrl'])
                picture = await this.onLoadedPhoto(this.client['pictureUrl']);
        } catch (error) {

        }
        let body = this._buildBody(fiche);
        return {
            content: [
                {
                    margin: [0, 2, 0, 4],
                    table: {
                        widths: ['*'],
                        body: [
                            [{
                                width: '*',
                                text: "FICHE DES CONDITIONS D'ACCES",
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
                    text: this.produit ? `Condition d'accès du produit ${fiche[0].produit}` : `Condition d'accès du client ${this.client.name} ${this.client.firstName}`,
                    style: "firstTitle",
                    alignment: 'center',
                    bold: true,
                    width: '*'
                },
                {
                    table: {
                        widths: ['*', 'auto'],
                        body: [
                            [[
                                {
                                    text: `${this.client.name} ${this.client.firstName}`,
                                    style: 'subTitle',
                                    width: '*'
                                },
                                {
                                    text: `${this.client.code || this.client.userReference}`,
                                    style: 'reference',
                                    width: '*'
                                }
                            ], picture ? {
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
                            return 0;
                        },
                        vLineWidth: function (i, node) {
                            return 0;
                        },
                        hLineColor: function (i, node) {
                            return 'gray';
                        },
                        vLineColor: function (i, node) {
                            return 'gray';
                        }
                    }
                },
                ...body

            ],
            styles: {
                noteFinale: {
                    bold: true,
                    fontSize: 19
                },
                noteMin: {
                    bold: true,
                    fontSize: 19
                },
                firstTitle: {
                    fontSize: 21,
                    margin: [0, 5, 0, 5]
                },
                finalResult: {
                    fontSize: 23,
                    margin: [0, 5, 0, 5],
                    decoration: 'underline'
                },
                name: {
                    bold: true
                },
                condition: {
                    fontSize: 12
                },
                element: {
                    fontSize: 12
                },
                noCondition: {
                    color: "#636c72",
                    margin: [0, 20, 0, 2]
                },
                note: {
                    fontSize: 12,
                    alignment: 'right',
                    italics: true
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
                    //padding:[0,3,0,0],
                    margin: [4, 8, 4, 8],
                },
                reference: {
                    fontSize: 13,
                    italics: true
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
                    bold: true,
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
    private _buildBody(fiche) {
        if (!this.fiche.length) {
            return [{
                text: "Ce client n'a pas passé de condition d'accès",
                style: "noCondition",
                alignment: 'center',
                width: '*',
                bold: true
            }];
        }
        let body = [], conds = [];
        let prevProduit, prevCategorie, prev;
        for (let index = 0, len = this.fiche.length; index < len; index++) {
            const element = this.fiche[index];
            if (!this.produit && element.produit !== prevProduit) {
                prevProduit = null; prevCategorie = null; prev = null;
                body.push(
                    {
                        style: 'subTable',
                        table: {
                            widths: ['*', 'auto'],
                            body: [
                                [{
                                    text: `Produit ${element.produit}`,
                                    style: 'produit',
                                    width: '*',
                                    alignment: 'center'
                                }, {
                                    text: '',
                                    alignment: 'right'
                                }]
                            ]
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return 0;
                            },
                            vLineWidth: function (i, node) {
                                return 0;
                            },
                            hLineColor: function (i, node) {
                                return 'gray';
                            },
                            vLineColor: function (i, node) {
                                return 'gray';
                            },
                        }
                    }
                );
            }
            if (!(!prevCategorie || (prevCategorie === element.categorie && prevProduit === element.produit))) {
                body.push({
                    style: "table",
                    alignment: 'justify',
                    table: {
                        widths: ['*', '*', 'auto'],
                        body: [
                            [{
                                text: "Conditions",
                                width: '*',
                                style: 'label'
                            },
                            {
                                text: "elements choisis",
                                width: '*',
                                style: 'label'
                            },
                            {
                                text: "Notes données",
                                width: 'auto',
                                style: 'label'
                            }
                            ],
                            ...conds
                        ]
                    },
                    layout: {
                        fillColor: function (i, node) {
                            return (i % 2 === 0) ? '#f5f5f5' : null;
                        },
                        hLineWidth: function (i, node) {
                            return 0.5;
                        },
                        vLineWidth: function (i, node) {
                            return 0.5;
                        }
                    }
                });
                conds = [];
            }
            if (!prevProduit || prevCategorie !== element.categorie) {
                body.push(
                    {
                        style: 'subTable',
                        table: {
                            widths: ['*', 'auto'],
                            body: [
                                [{
                                    text: `${element.categorie}`,
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
                                return 0.4;
                            },
                            vLineWidth: function (i, node) {
                                return i == 0 || i == node.table.widths.length ? 0.4 : 0;
                            },
                            hLineColor: function (i, node) {
                                return 'gray';
                            },
                            vLineColor: function (i, node) {
                                return 'gray';
                            },
                        }
                    }
                );
            }
            conds.push([
                {
                    text: `${element.condition}`,
                    width: '*',
                    style: 'condition'
                },
                {
                    text: `${element.element}`,
                    width: '*',
                    style: 'element'
                },
                {
                    text: `${element.note_element}`,
                    width: 'auto',
                    style: 'note'
                }
            ]);
            prevCategorie = element.categorie;
            if (index + 1 === len || (index && !prevProduit && prevProduit !== element.produit)) {
                body.push({
                    style: "table",
                    alignment: 'justify',
                    table: {
                        widths: ['*', '*', 'auto'],
                        body: [
                            [{
                                text: "Conditions",
                                width: '*',
                                style: 'label'
                            },
                            {
                                text: "elements choisis",
                                width: '*',
                                style: 'label'
                            },
                            {
                                text: "Notes données",
                                width: 'auto',
                                style: 'label'
                            }
                            ],
                            ...conds
                        ]
                    },
                    layout: {
                        fillColor: function (i, node) {
                            return (i % 2 === 0) ? '#f5f5f5' : null;
                        },
                        hLineWidth: function (i, node) {
                            return 0.5;
                        },
                        vLineWidth: function (i, node) {
                            return 0.5;
                        }
                    }
                });
                body.push({
                    margin: [0, 5, 0, 5],
                    columns: [
                        [{
                            text: "Note minimum du produit",
                            width: '*',
                            alignment: 'center',
                            style: 'noteMinlabel'
                        },
                        {
                            text: `${element.note_min}`,
                            width: '*',
                            style: 'noteMin',
                            alignment: 'center'
                        }],
                        [{
                            text: "Note finale",
                            width: '*',
                            style: 'noteFinalelabel',
                            alignment: 'center'
                        },
                        {
                            text: `${element.note_client}`,
                            width: '*',
                            style: 'noteFinale',
                            alignment: 'center'
                        }]
                    ]
                });
                body.push({
                    text: (element.note_min > element.note_client ? "N'a pas réussi" : "A réussi").toUpperCase(),
                    style: "finalResult",
                    alignment: 'center',
                    width: '*',
                    bold: true
                });
            }
            prevProduit = element.produit;
        }
        return body;
    }
}
