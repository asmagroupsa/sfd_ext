import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ImageService} from '../../shared/image.service';
import {ClientService} from './client.service';
import {AddressService} from '../address/address.service';
// import {AddressService} from '../address';

declare const pdfMake: any;

@Component({
    selector: 'jhi-client-membership-form-new',
    templateUrl: './client-membership-form-new.component.html',
})
export class ClientMembershipFormNewComponent implements AfterViewInit {
    @ViewChild('iframe')
    private _iframe: ElementRef;
    private _image: string;
    private _headerImage: string;
    private _data: any = {};
    loading = 0;
    private _clientId: number;
    private _addresses: any[] = [];

    constructor(
        private _datePipe: DatePipe,
        private _clientService: ClientService,
        private _activatedRoute: ActivatedRoute,
        private _imageService: ImageService,
        private _addressService: AddressService,
    ) {}

    ngAfterViewInit() {
        this._getClient();
        this._getAdresses();
    }

    private _buildPDF() {
        const headerFontSize = 22;
        const textFontSize = 18;
        const tableLayout: any = {
            fillColor: (i) => {
                if (i === 0) {
                    return '#4d6cfa';
                }

                return ((i % 2) === 0) ? '#c6e7fd' : null;
            },
            hLineWidth: () => 0,
            vLineWidth: (i, node) => ((0 < i) && (i < node.table.widths.length)) ? 1 : 0,
            vLineColor: (i, node) => ((0 < i) && (i < node.table.widths.length))? '#fff' : null,
        };
        const sectionTablelayout: any = {
            hLineColor: 'gray',
            vLineColor: 'gray',
        }

        const doc: any = {
            content: [
                this._headerImage ? {
                    image: this._headerImage,
                    width: 515,
                    margin: [0, 15, 0, 0],
                } : '',
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: "FICHE D' ADHESION",
                                    alignment: 'center',
                                    bold: true,
                                    fontSize: 30,
                                    margin: [0, 5],
                                }
                            ]
                        ]
                    },
                    margin: [0, 0, 0, 15],
                },
                {
                    columns: [
                        {
                            width: '*',
                            text: '',
                        },
                        {
                            width: 'auto',
                            table: {
                                body: [
                                    [
                                        {
                                            text: 'Agence',
                                            style: 'tableHeder'
                                        },
                                    ],
                                    [
                                        [
                                            {
                                                text: this._data.nomagence,
                                            },
                                            {
                                                text: `Tél: ${this._data.agence_phone}`,
                                            },
                                        ],
                                    ],
                                ],
                            },
                            layout: tableLayout,
                        },
                    ],
                    margin: [0, 0, 0, 15],
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
                                                text: this._activatedRoute.snapshot.queryParams.clientRef,
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
                                                text: this._data.compte_carmes,
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
                                                text: `${this._data.nomduclient} ${this._data.prenomsduclient}`,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Sexe:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._data.sexe,
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
                            [
                                {
                                    colSpan: 2,
                                    table: {
                                        widths: ['*', '*', 0],
                                        body: [
                                            [
                                                {
                                                    columns: [
                                                        {
                                                            width: '*',
                                                            text: 'Téléphone:',
                                                            style: 'textStyle',
                                                        },
                                                        {
                                                            width: 'auto',
                                                            text: this._data.tel,
                                                            style: 'textStyle',
                                                        },
                                                    ]
                                                },
                                                {
                                                    colSpan: 2,
                                                    columns: [
                                                        {
                                                            width: '*',
                                                            text: 'Profession:',
                                                            style: 'textStyle',
                                                        },
                                                        {
                                                            width: 'auto',
                                                            text: this._data.profession,
                                                            style: 'textStyle',
                                                        },
                                                    ]
                                                },
                                                ''
                                            ],
                                            [
                                                {
                                                    columns: [
                                                        {
                                                            width: '*',
                                                            text: 'Date de naiss.:',
                                                            style: 'textStyle',
                                                        },
                                                        {
                                                            width: 'auto',
                                                            text: this._datePipe.transform(new Date(this._data.datedenaissance), 'mediumDate'),
                                                            style: 'textStyle',
                                                        },
                                                    ]
                                                },
                                                {
                                                    colSpan: 2,
                                                    columns: [
                                                        {
                                                            width: '*',
                                                            text: 'Lieu de naiss.:',
                                                            style: 'textStyle',
                                                        },
                                                        {
                                                            width: 'auto',
                                                            text: this._data.lieudenaissance,
                                                            style: 'textStyle',
                                                        },
                                                    ]
                                                },
                                                ''
                                            ],
                                            [
                                                {
                                                    columns: [
                                                        {
                                                            width: '*',
                                                            text: 'Type de pièce:',
                                                            style: 'textStyle',
                                                        },
                                                        {
                                                            width: 'auto',
                                                            text: this._data.carte_type,
                                                            style: 'textStyle',
                                                        },
                                                    ]
                                                },
                                                {
                                                    colSpan: 2,
                                                    columns: [
                                                        {
                                                            width: '*',
                                                            text: 'N° de pièce:',
                                                            style: 'textStyle',
                                                        },
                                                        {
                                                            width: 'auto',
                                                            text: this._data.ncnipassport,
                                                            style: 'textStyle',
                                                        },
                                                    ]
                                                },
                                                ''
                                            ],
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 0,
                                        vLineWidth: (i) => (i === 1 ? 1 : 0),
                                        vLineColor: 'gray',
                                    }
                                },
                                ''
                            ],
                        ]
                    },
                    margin: [0, 0, 0, 15],
                    layout: sectionTablelayout,
                },
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'ADRESSES',
                                    style: 'headerStyle',
                                },
                            ],
                            [
                                {
                                    table: {
                                        widths: ['*', '*', '*'],
                                        body: (() => {
                                            const body: any[] = [
                                                [
                                                    {
                                                        text: 'Domicile',
                                                        style: 'tableHeder'
                                                    },
                                                    {
                                                        text: 'Quartier',
                                                        style: 'tableHeder'
                                                    },
                                                    {
                                                        text: 'Ville',
                                                        style: 'tableHeder'
                                                    },
                                                ],
                                            ];

                                            for (const a of this._addresses) {
                                                body.push([
                                                    {
                                                        text: a.home,
                                                        alignment: 'center',
                                                    },
                                                    {
                                                        text: a.district.name,
                                                        alignment: 'center',
                                                    },
                                                    {
                                                        text: a.district.townShip.city.name,
                                                        alignment: 'center',
                                                    },
                                                ]);
                                            }

                                            return body;
                                        })()
                                    },
                                    layout: tableLayout,
                                },
                            ],
                        ]
                    },
                    margin: [0, 0, 0, 15],
                    layout: sectionTablelayout,
                },
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'COMPTE',
                                    style: 'headerStyle',
                                },
                            ],
                            [
                                [
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Numero:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._data.ndecompte,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: 'Produit Epargne:',
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._data.produitEpargne,
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '*',
                                                text: "Date d' adhesion:",
                                                style: 'textStyle',
                                            },
                                            {
                                                width: 'auto',
                                                text: this._datePipe.transform(new Date(this._data.dateadhesion), 'mediumDate'),
                                                style: 'textStyle',
                                            },
                                        ],
                                        style: 'columStyle',
                                    },
                                ],
                            ],
                        ]
                    },
                    margin: [0, 0, 0, 15],
                    layout: sectionTablelayout,
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
                    fontSize: headerFontSize,
                },
                tableHeder: {
                    fillColor: '#4d6cfa',
                    color: '#fff',
                    alignment: 'center',
                    bold: true,
                }
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
            // header: (currentPage, pageCount) => ({
            //     image: headerImage,
            //     width: 515,
            //     margin: [40, 10, 40, 50]
            // }),
        };

        const pdf = pdfMake.createPdf(doc);

        pdf.getDataUrl((dataUrl) => {
            this._iframe.nativeElement.src = dataUrl;
        });
    }

    private _getClient() {
        this.loading++;
        this._clientId = +this._activatedRoute.snapshot.params.id;

        this._clientService.membershipForm(this._clientId)
        .then((data) => {
            this._data = data;
            const pictureUrl = this._data.picture_url;

            if (pictureUrl && (pictureUrl !== 'NONE')) {
                this._imageService.getImageDataString(pictureUrl)
                .then((image) => {
                    this.loading--;
                    this._image = image;
                    this._buildPDF();
                })
                .catch(() => {
                    this.loading--;
                    this._buildPDF();
                });
            }
            else {
                this.loading--;
                this._buildPDF();
            }
        })
        .catch(() => {
            this.loading--;
        });
    }

    private _getAdresses() {
        this.loading++;
        this._addressService.query({'clientId.equals': this._clientId})
        .toPromise()
        .then((r) => {
            this.loading--;
            this._addresses = r.json;
            this._buildPDF();
        })
        .catch(() => {
            this.loading--;
            this._buildPDF();
        });
    }
}
