import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {CreditRequestService} from './credit-request.service';
import {ActivatedRoute} from '@angular/router';
import {ImageService} from '../../shared/image.service';
import { numberWithSpaces } from '../../shared';

declare const pdfMake: any;

@Component({
    selector: 'jhi-credit-request-print-new',
    templateUrl: './credit-request-print-new.component.html',
})
export class CreditRequestPrintNewComponent implements AfterViewInit {
    @ViewChild('iframe')
    private _iframe: ElementRef;
    private _image: string;
    private _creditRequest: any = {
        produit: {},
        client: {},
        periodicity: {},
        requestObject: {},
    };
    loading = false;

    constructor(
        private _currencyPipe: CurrencyPipe,
        private _datePipe: DatePipe,
        private _creditRequestService: CreditRequestService,
        private _activatedRoute: ActivatedRoute,
        private _imageService: ImageService,
    ) {}

    ngAfterViewInit() {
        this._getCreditRequest();
    }

    private _buildPDF() {
        const headerFontSize = 25;
        const textFontSize = 20;
        const layout: any = {
            hLineColor: 'gray',
            vLineColor: 'gray',
        }

        const doc: any = {
            content: [
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'DEMANDE DE CREDIT',
                                    alignment: 'center',
                                    bold: true,
                                    fontSize: 30,
                                    margin: [0, 5],
                                }
                            ]
                        ]
                    },
                    margin: [0, 0, 0, 30],
                },
                {
                    table: {
                        widths: ['*', 75],
                        body: [
                            [
                                {
                                    text: 'CLIENT',
                                    colSpan: 2,
                                    style: 'headerStyle',
                                },
                                ''
                            ],
                            [
                                [
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Référence:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._creditRequest.client.code,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Nom & Prénoms:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._creditRequest.clientLib,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Compte CARMES:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._creditRequest.client.cpteCarmes,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                ],
                                this._image ? {
                                    image: this._image,
                                    width: 75,
			                        height: 75,
                                } : '',
                            ],
                        ]
                    },
                    margin: [0, 0, 0, 15],
                    layout: layout,
                },
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'PRODUIT',
                                    style: 'headerStyle',
                                },
                            ],
                            [
                                [
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Référence:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._creditRequest.produit.code,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Désignation:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._creditRequest.produit.libelle,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                ]
                            ],
                        ]
                    },
                    margin: [0, 0, 0, 15],
                    layout: layout,
                },
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'DEMANDE',
                                    style: 'headerStyle',
                                },
                            ],
                            [
                                [
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Référence:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._creditRequest.reference,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Montant:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: numberWithSpaces(this._creditRequest.amount)+"FCFA",
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Date:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._datePipe.transform(new Date(this._creditRequest.requestDate), 'mediumDate'),
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Durée:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: `${this._creditRequest.duration} mois`,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Périodicité:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._creditRequest.periodicity.libPeriodicite,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Différé:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._creditRequest.nbrDiffere,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Expression:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._creditRequest.expressionRequest,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Objet:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._creditRequest.requestObject.name,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                ]
                            ],
                        ]
                    },
                    layout: layout,
                },
            ],
            styles: {
                textStyle: {
                    fontSize: textFontSize,
                },
                columStyle: {
                    margin: [0, 5],
                    fontSize: headerFontSize,
                },
                headerStyle: {
                    fillColor: '#c6e7fd',
                    // fillColor: '#4d6cfa',
                    fontSize: headerFontSize,
                    // color: '#fff',
                },
            },
            footer: (currentPage, pageCount) => ({
                columns: [
                    {
                        width: '*',
                        text: `${currentPage}/${pageCount}`,
                        alignment: 'right',
                    }
                ],
                margin: [50, 10, 40, 0]
            }),
        };

        const pdf = pdfMake.createPdf(doc);

        pdf.getDataUrl((dataUrl) => {
            this._iframe.nativeElement.src = dataUrl;
        });
    }
    
    private _getCreditRequest() {
        this.loading = true;
        this._creditRequestService.find(+this._activatedRoute.snapshot.params.id)
        .toPromise()
        .then((creditRequest) => {
            this._creditRequest = creditRequest;
            const pictureUrl = this._creditRequest.client.pictureUrl

            if (pictureUrl) {
                this._imageService.getImageDataString(pictureUrl)
                .then((image) => {
                    this.loading = false;
                    this._image = image;
                    this._buildPDF();
                })
                .catch(() => {
                    this.loading = false;
                    this._buildPDF();
                });
            }
            else {
                this.loading = false;
                this._buildPDF();
            }
        })
        .catch();
    }
}
