import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {DatePipe, CurrencyPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {CompensationService} from './compensation.service';
import {ImageService} from '../../shared/image.service';
import {UserData} from '../../shared';

declare const pdfMake: any;
declare let qrGenerator: any;
declare let toWords: any;

@Component({
    selector: 'jhi-transfer-order-print',
    templateUrl: './transfer-order-print.component.html',
})
export class TransferOrderPrintComponent implements AfterViewInit {
    @ViewChild('iframe')
    private _iframe: ElementRef;
    private _reference: string;
    private _data: TransferOrderPDFMakeDocDataType = {};
    loading = 0;

    constructor(
        private _datePipe: DatePipe,
        private _currencyPipe: CurrencyPipe,
        private _compensationService: CompensationService,
        private _activatedRoute: ActivatedRoute,
        private _imageService: ImageService,
    ) {}

    ngAfterViewInit() {
        this._getTransferOrder();
        this._getSFDHeaderImage();
    }

    private _buildPDF() {
        if (this.loading !== 0) {
            return;
        }

        qrGenerator().toDataURL(
            JSON.stringify({
                type: 'order',
                reference: this._reference,
            }),
            {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                rendererOpts: {
                    quality: 0.3
                }
            },
            (err, url) => {
                if (err) {
                    return;
                }

               this._data.qrCodeImage = url;

               pdfMake.createPdf(transferOrderPDFMakeDoc(this._data))
               .getDataUrl((dataUrl) => {
                   this._iframe.nativeElement.src = dataUrl;
               });
            }
        );
    }

    private _getTransferOrder() {
        this.loading++;

        this._compensationService.findOrdreVirement(+this._activatedRoute.snapshot.params.id)
        .toPromise()
        .then((transferOrder) => {
            this._reference = transferOrder.reference;

            this._data = {
                entitled: transferOrder.intituleOrdre,
                emiterName: transferOrder.nomDonneurOrdre,
                beneficiary: transferOrder.nomBeneficiaire,
                bankName: transferOrder.bankLibelle,
                motif: transferOrder.motifPaiement,
                amountInLetters: toWords(transferOrder.montantVirement).toUpperCase(),
                date: this._datePipe.transform(new Date(), 'mediumDate'),
                amountInNumber: this._currencyPipe.transform(transferOrder.montantVirement, 'XAF', true, '2.0-3'),
            };

            this._getEmiterBankAccountClient(transferOrder.numeroCompteDonneurOrdre);
            this._getReceiverBankAccountClient(transferOrder.numeroComptBeneficiaire);
        })
        .catch(() => {
            this.loading--;
        });
    }

    private _getEmiterBankAccountClient(numAccount) {
        this._compensationService.getBankAccountClientByNumAccount(numAccount)
        .then((bankAccountClient) => {
            this.loading--;
            this._data.emiter = {
                codeAgence: bankAccountClient.codeAgence,
                codeBank: bankAccountClient.codeBank,
                codePays: bankAccountClient.codePays,
                rib: bankAccountClient.rib,
                numAccount: bankAccountClient.numAccount,
            };

            this._buildPDF();
        })
        .catch(() => {
            this.loading--;
        })
    }

    private _getReceiverBankAccountClient(numAccount) {
        this.loading++;
        this._compensationService.getBankAccountClientByNumAccount(numAccount)
        .then((bankAccountClient) => {
            this.loading--;
            this._data.receiver = {
                codeAgence: bankAccountClient.codeAgence,
                codeBank: bankAccountClient.codeBank,
                codePays: bankAccountClient.codePays,
                rib: bankAccountClient.rib,
                numAccount: bankAccountClient.numAccount,
            };

            this._buildPDF();
        })
        .catch(() => {
            this.loading--;
        });
    }

    private _getSFDHeaderImage() {
        this.loading++;

        this._imageService.getSFDHeaderImage()
        .then((data) => {
            this.loading--;
            this._data.headerImage = data;
            console.log(data);

            this._buildPDF();
        })
        .catch(() => {
            this.loading--;
            this._buildPDF();
        });
    }
}

type TransferOrderPDFMakeDocDataType = {
    emiter?: {
        codePays?: string,
        codeBank?: string,
        codeAgence?: string,
        numAccount?: string,
        rib?: string,
    },
    receiver?: {
        codePays?: string,
        codeBank?: string,
        codeAgence?: string,
        numAccount?: string,
        rib?: string,
    },
    qrCodeImage?: string,
    headerImage?: string,
    entitled?: string,
    beneficiary?: string,
    bankName?: string,
    motif?: string,
    amountInNumber?: string,
    amountInLetters?: string,
    date?: string,
    emiterName?: string,
};

function transferOrderPDFMakeDoc(data: TransferOrderPDFMakeDocDataType) {
    const headerFontSize = 25;
    const textFontSize = 18;
    const tableLayout: any = {
        hLineWidth: () => 0,
        vLineWidth: (i, node) => ((0 < i) && (i < node.table.widths.length)) ? 1 : 0,
        vLineColor: (i, node) => ((0 < i) && (i < node.table.widths.length))? '#fff' : null,
    };
    const sectionTablelayout: any = {
        hLineColor: 'gray',
        vLineColor: 'gray',
    }

    return {
        content: [
            /* data.headerImage ? {
                image: data.headerImage,
                width: 515,
                margin: [0, 0, 0, 15],
            } : '',
            {
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                text: 'ORDRE DE VIREMENT',
                                alignment: 'center',
                                bold: true,
                                fontSize: 30,
                                margin: [0, 5],
                            }
                        ]
                    ]
                },
                margin: [0, 0, 0, 15],
            }, */
            {
                columns: [
                    data.headerImage ? {
                        image: data.headerImage,
                        width: 240,
                        // margin: [0, 0, 0, 15],
                    } : '',
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
                                        text: 'ORDRE DE VIREMENT',
                                        alignment: 'center',
                                        // bold: true,
                                        // fontSize: 20,
                                        margin: [10, 5],
                                    }
                                ]
                            ]
                        },
                        layout: {
                            fillColor: () => '#ddd',
                            vLineWidth: () => 0,
                            hLineWidth: () => 0,
                        }
                    },
                ],
                margin: [0, 0, 0, 10],
            },
            {
                stack: [
                    {
                        text: 'Par le débit de mon compte N°',
                        alignment: 'center',
                    }
                ]
            },
            {
                columns: ((emiter) => {
                    const columnsData: any[] = [
                        `${emiter.codePays || ''}${emiter.codeBank || ''}`,
                        `${emiter.codeAgence || ''}`,
                        `${emiter.numAccount || ''}`,
                        `${emiter.rib || ''}`,
                    ];
                    const columns: any[] = [];

                    for (const i in columnsData) {
                        const data = columnsData[+i];

                        if (data.length > 0) {
                            if (columns.length >= 1) {
                                columns.push({
                                    text: '',
                                    width: '*'
                                });
                            }

                            columns.push({
                                width: 'auto',
                                table: {
                                    body: [data.split('')]
                                }
                            });
                        }
                    }

                    return columns;
                })(data.emiter || {}),
            },
            {
                columns: [
                    {
                        text: `Nom du donneur d' ordre:`,
                        width: '*',
                        bold: true,
                    },
                    {
                        width: 'auto',
                        text: data.emiterName || '...',
                    },
                ],
                style: 'columStyle',
            },
            {
                columns: [
                    {
                        text: 'Intitulé:',
                        width: '*',
                        bold: true,
                    },
                    {
                        width: 'auto',
                        text: data.entitled || '...',
                    },
                ],
                style: 'columStyle',
            },
            {
                columns: [
                    {
                        text: 'Vueillez virer en faveur de:',
                        width: '*',
                        bold: true,
                    },
                    {
                        text: data.beneficiary || '...',
                        width: 'auto',
                    },
                ],
                style: 'columStyle',
            },
            {
                columns: [
                    {
                        width: 'auto',
                        text: 'RIB',
                        bold: true,
                    },
                    {
                        width: 10,
                        text: '',
                    },
                    {
                        width: '*',
                        columns: ((receiver) => {
                            const columnsData: any[] = [
                                `${receiver.codePays || ''}${receiver.codeBank || ''}`,
                                `${receiver.codeAgence || ''}`,
                                `${receiver.numAccount || ''}`,
                                `${receiver.rib || ''}`,
                            ];
                            const columns: any[] = [];

                            for (const i in columnsData) {
                                const data = columnsData[+i];

                                if (data.length > 0) {
                                    if (columns.length >= 1) {
                                        columns.push({
                                            text: '',
                                            width: '*'
                                        });
                                    }

                                    columns.push({
                                        width: 'auto',
                                        table: {
                                            body: [data.split('')]
                                        }
                                    });
                                }
                            }

                            return columns;
                        })(data.receiver || {}),
                    },
                ],
                style: 'columStyle',
            },
            {
                columns: [
                    {
                        text: 'Banque:',
                        width: '*',
                        bold: true,
                    },
                    {
                        text: data.bankName || '...',
                        width: 'auto',
                    },
                ],
                style: 'columStyle',
            },
            {
                columns: [
                    {
                        text: 'La somme de:',
                        width: '*',
                        bold: true,
                    },
                    {
                        text: data.amountInNumber || '...',
                        width: 'auto',
                    },
                ],
                style: 'columStyle',
            },
            {
                columns: [
                    {
                        text: 'Montant en lettres:',
                        width: '*',
                        bold: true,
                    },
                    {
                        text: data.amountInLetters || '...',
                        width: 'auto',
                    },
                ],
                style: 'columStyle',
            },
            {
                columns: [
                    {
                        text: 'Motif:',
                        width: '*',
                        bold: true,
                    },
                    {
                        text: data.motif || '...',
                        width: 'auto',
                    },
                ],
                style: 'columStyle',
            },
            {
                columns: [
                    {
                        width: '50%',
                        columns: [
                            {
                                text: 'Date:',
                                width: '*',
                                bold: true,
                            },
                            {
                                text: data.date || '...',
                                width: 'auto',
                            },
                        ]
                    },
                    {
                        width: '50%',
                        columns: [
                            {
                                text: 'Nom, Tél & Signature',
                                width: '*',
                                bold: true,
                                alignment: 'right',
                            },
                        ]
                    },
                ],
                style: 'columStyle',
            },
            {
                stack: [
                    {
                        text: 'RESERVE A LA BANQUE',
                        alignment: 'center',
                        color: '#fff',
                        background: '#000',
                        margin: [10, 10],
                    }
                ],
                style: 'columStyle',
            },
            data.qrCodeImage ? {
                stack: [
                    {
                        image: data.qrCodeImage,
                        width: 75,
                        height: 75,
                        alignment: 'center',
                    }
                ],
                absolutePosition: {
                    x: 40,
                    y: 700,
                }
            } : '',
        ],
        styles: {
            columStyle: {
                margin: [0, 5],
            },
        },
        defaultStyle: {
            fontSize: 17
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
}
