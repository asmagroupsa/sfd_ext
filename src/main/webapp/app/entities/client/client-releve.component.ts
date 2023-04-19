import 'rxjs/add/operator/map';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { READFILEURL, ResponseWrapper, UserData, createRequestOption, Principal, numberWithSpaces, READBITFILEURL } from '../../shared';
import { OperationComptableService } from '../operation-comptable/operation-comptable.service';
import { Client } from './client.model';
import { ClientService } from './client.service';

declare const select_init: any;
declare let pdfMake: any;

@Component({
    selector: 'jhi-client-releve',
    templateUrl: './client-releve.component.html'
})
export class ClientReleveComponent {
    operations: any[] = [];
    loading: boolean = false;
    currentCompte: any;
    params: any = {};
    client: Client;
    accounts: any[];
    @ViewChild('releveFrame') releveFrame: any;
    message: string;
    period: string;
    header: string;
    date1: any;
    date2: any;

    constructor(
        private operationService: OperationComptableService,
        private activatedRoute: ActivatedRoute,
        private clientService: ClientService,
        private http: Http, private _datePipe: DatePipe,
        // private currencyPipe: CurrencyPipe,
        private _decimalPipe: DecimalPipe,
        private _principal: Principal,
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.params = params;
            this.getClient();
            this.getAgent();
        });
        let now = new Date();
        this.date1 = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };
        this.date2 = Object.assign({}, this.date1);
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        select_init();
    }
    getClient() {
        if (!this.params['client']) return;
        this.clientService.find(+this.params['client'])
            .subscribe(
                (res) => {
                    this.client = res;
                    this.operations = [];
                    this.currentCompte = '';
                    if (this.client && this.client.comptes)
                        this.accounts = this.client.comptes || [];
                    select_init();
                },
                (res: ResponseWrapper) => {
                }
            );
    }
    getAgent() {
        if (!this.params['agent']) return;
        this.clientService.getByCARMESAccount(+this.params['agent'])
            .then((client) => {

                this.client = client;
                this.operations = [];
                this.currentCompte = '';
                if (this.client && this.client.comptes)
                    this.accounts = this.client.comptes || [];
                select_init();
            })
            .catch(() => {

            });
    }
    onPeriodChange() {
        //console.log(this.date1, this.date2);
        this._getData();
    }
    _getData() {
        if (!this.currentCompte) return;
        const formatDate = (date) => this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'dd-MM-y');
        this.operationService.listeOperations(
            this.currentCompte,
            {
                date1: formatDate(this.date1),
                date2: formatDate(this.date2)
            })
            .subscribe(
                (res: ResponseWrapper) => {
                    this.loading = true;
                    this.operations = res.json;
                    if (this.operations.length) {
                        let soldePrecedent = this.operations[0];
                        this.operations.splice(0, 1);
                        this.operations.reverse();
                        this.operations.unshift(soldePrecedent);
                    }
                    //if (this.operations.length)
                    this.buildReleve(this.client);
                    /* else
                        this.message = "Pas d'opérations sur ce compte"; */
                },
                (res: ResponseWrapper) => {
                    this.loading = true;
                }
            );
    }
    onCompteChange() {
        this.operations = [];
        this._getData();
    }
    totaldebitCredit(debit: boolean = true) {
        let total = 0;
        if (!this.operations.length) return total;
        this.operations.forEach(operation => {
            total += debit ? +operation.debit : +operation.credit;
        });
        return total;
    }
    _buildBody(): any[] {
        let tabBody = [];
        let style, solde;
        let len = this.operations.length;
        let date;
        for (let index = 0; index < len; index++) {
            const element = this.operations[index];
            style = index % 2 == 0 ? 'tabBodyEven' : 'tabBodyOdd';
            date = new Date(element.created_date);
            let date2 = this._datePipe.transform(date, 'dd/MM/yyyy-HH:mm');
            if (index === 1) {
                this.period = this._datePipe.transform(date, 'mediumDate');
            } else if (index + 1 === len) {
                this.period = `${this.period || ''}` + `${this.period ? ' au ' : ''}` + this._datePipe.transform(date, 'mediumDate');
            }
            if (index === 0) {
                //date2 = "";
                element.sens = element.debit;
                element.debit = '';
                solde = +element.sens || 0;
                element.observation = "Report à nouveau";
            } else {
                if (element.debit)
                    solde -= +element.debit;
                else if (element.credit)
                    solde += +element.credit;
            }
            tabBody.push([
                {
                    style: '',
                    text: `${date2}`
                },
                {
                    style: style,
                    text: element.reference,
                },
                {
                    style: style,
                    text: `${element.observation}`
                },
                /* {
                    style:style,
                    text:"element.ref"
                }, */
                {
                    style: style,
                    text: `${element.debit ? this._formatAmount(element.debit || 0) : ''}`
                },
                {
                    style: style,
                    text: `${element.credit ? this._formatAmount(element.credit || 0) : ''}`
                },
                {
                    style: style,
                    text: `${this._formatAmount(solde || 0)}`
                }
            ]);
        }
        style = len % 2 == 0 ? 'tabBodyEven' : 'tabBodyOdd';
        /* tabBody.push([
            "", "", "", "", ""
        ]); */
        if (len) {
            const t1 = this.totaldebitCredit() || 0;
            const t2 = this.totaldebitCredit(false) || 0;

            tabBody.push([
                /* {
                    style: style,
                    text: ""
                }, */
                {
                    style: 'total',
                    text: "** Total **",
                    colSpan: 3,
                    color: '#fff',
                    alignment: 'center',
                    fillColor: 'blue',
                },
                {},
                {},
                {
                    style: 'debit',
                    margin: [0, 5, 3, 0],
                    alignment: 'right',
                    text: this._formatAmount(t1),
                    color: '#fff',
                    fillColor: 'blue',
                },
                {
                    style: 'debit',
                    margin: [0, 5, 3, 0],
                    alignment: 'right',
                    text: this._formatAmount(t2),
                    color: '#fff',
                    fillColor: 'blue',
                },
                {
                    style: 'credit',
                    margin: [0, 5, 3, 0],
                    alignment: 'right',
                    text: this._formatAmount(solde),
                    color: '#fff',
                    fillColor: 'blue',
                }
            ]);
        }

        return tabBody;
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
    async buildReleve(client) {
        let data = this._buildBody();
        if (UserData.getInstance().sfd_ && UserData.getInstance().sfd_.entete) {
            try {
                this.header = await this.onLoadedPhoto(UserData.getInstance().sfd_.entete);
            } catch (error) {

            }
        }
        let clientName = client.name;
        if (client.firstName)
            clientName += ' ' + client.firstName;
        let widths = ['*', '*', '*', '*', '*', '*'];
        let table;
        table = {
            style: 'noOperation',
            text: "Pas d'opérations sur ce compte"
        };
        if (this.operations && this.operations.length > 1) {
            // widths = ['auto', 'auto', '*', 'auto', 'auto', 'auto'];
            widths = ['10%', '10%', '38%', '14%', '14%', '14%'];
            table = {
                style: 'tableStyle',
                table: {
                    headerRows: 1,
                    widths: widths,
                    body: [
                        [{
                            text: "Date",
                            style: "tableHeader"
                        },
                        {
                            text: "Référence",
                            style: "tableHeader"
                        },
                        {
                            text: "Description",
                            style: "tableHeader"
                        },
                        /* {
                            text:"Ref",
                            style:"tableHeader"
                        }, */
                        {
                            text: "Debit",
                            style: "tableHeader"
                        },
                        {
                            text: "Credit",
                            style: "tableHeader"
                        },
                        {
                            text: "Solde",
                            style: "tableHeader"
                        }
                        ],
                        ...data
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return 0;
                    },
                    vLineWidth: function (i, node) {
                        //if (i == 0) return 1;
                        return i == 0 || i == node.table.widths.length ? 0 : 1;
                    },
                    vLineColor: (i, node) => '#fff',
                    fillColor: function (i, node) {
                        if (i == 0) return 'blue';
                        return (i % 2 === 0) ? '#afced7' : null;
                    }
                }
            };
        }
        let content: any = [
            "\n",
            {
                margin: [0, 15, 0, 50],
                columnGap: 10,
                columns: [
                    {
                        width: '*',
                        stack: [
                            {
                                text: 'Intitulé du compte: ' + clientName.toUpperCase(),
                                style: 'client'
                            },
                            {
                                text: 'Référence: ' + client.code.toUpperCase(),
                                style: 'clientCode'
                            },
                        ],
                    },
                    {
                        width: 'auto',
                        stack: [
                            {
                                text: "Période",
                                style: "countInfoTitle"
                            },
                            {
                                text: this.period || '',
                                style: "countInfoDetails"
                            }
                        ],
                    },
                    {
                        width: 'auto',
                        stack: [
                            {
                                text: "N° compte",
                                style: "countInfoTitle"
                            },
                            {
                                text: this.currentCompte || '',
                                style: "countInfoDetails"
                            }
                        ],
                    },
                    {
                        width: 'auto',
                        stack: [
                            {
                                text: "Devise",
                                style: "countInfoTitle"
                            },
                            {
                                text: 'FCFA',
                                style: "countInfoDetails"
                            },
                        ],
                    },
                ]
            },
            table
        ];
        if (this.header) {
            content.unshift({
                width: 495,
                image: this.header,
                height: 120,
                style: 'image'
            });
        }

        let by: any = '';
        try {
            by = await this._principal.identity();
            by = ' par ' + by.lastName + ' ' + by.firstName;
        } catch (e) {
            console.error(e);
            by = '';
        }

        let dd = {
            header: function (currentPage, pageCount) {
                return {
                    style: 'firstHeader',
                    columns: [
                        {
                            columns: [
                                /* {
                                    text:"Img",
                                    style:"bankImg"
                                }, */
                                [
                                    {
                                        text: "",
                                        style: "bankName"
                                    },
                                    {
                                        text: "",
                                        style: "bankAdress"
                                    },
                                    {
                                        text: "",
                                        style: "bankAdress"
                                    }
                                ]
                            ]
                        },
                        [
                            {
                                text: currentPage == 1 ? "RELEVÉ DE COMPTE" : '',
                                style: "checking"
                            },
                            {
                                text: `Page ${currentPage} of ${pageCount}`,
                                style: "checking"
                            }
                        ]
                    ]
                }
            },
            footer: (currentPage, pageCount) => ({
                columns: [
                    {
                        width: '*',
                        text: 'Imprimé le ' + this._datePipe.transform(new Date(), 'medium') + by,
                        italics: true,
                        fontSize: 8,
                        alignment: 'left',
                    },
                    {
                        width: '*',
                        text: 'SYGM@SFD v0.1',
                        italics: true,
                        fontSize: 8,
                        alignment: 'right',
                    },
                ],
                margin: [40, 10, 40, 0]
            }),
            content: content,
            styles: {
                image: {
                    margin: [0, 0, 45, 2]
                },
                bankImg: {
                    fontSize: 18,
                    bold: true,
                    width: 4,
                    height: 4
                },
                bankName: {
                    fontSize: 15,
                    bold: true,
                    alignment: 'left',
                    margin: [0, 0, 3, 0]
                },
                bankAdress: {
                    fontSize: 12,
                    alignment: 'left',
                    margin: [0, 0, 4, 0]
                },
                noOperation: {
                    alignment: 'center',
                    color: "gray",
                    fontSize: 14,
                    italics: true
                },
                firstHeader: {
                    margin: [0, 15, 40, 50]
                },
                checking: {
                    alignment: 'right'
                },
                countInfoDetails: {
                    fontSize: 8,
                    alignment: 'right'
                },
                countInfoTitle: {
                    //background: "blue",
                    margin: [0, 0, 4, 6],
                    //color: "white",
                    bold: true,
                    alignment: 'right'
                },
                tableStyle: {
                    margin: [0, 0, 0, 0],
                    fontSize: 8.5,
                    alignment: 'justify'
                },
                tableHeader: {
                    background: "blue",
                    color: "white",
                    bold: true,
                    border: [true, true, true, true]
                },
                tableHeaderCredit: {
                    background: "blue",
                    color: "white",
                    bold: true,
                    margin: [3, 0, 3, 0],
                    border: [true, true, true, true]
                },
                tableHeaderDebit: {
                    background: "blue",
                    color: "white",
                    bold: true,
                    margin: [3, 0, 3, 0],
                    border: [true, true, true, true]
                },
                tabBodyEven: {
                    margin: [1, 2, 1, 2],
                },
                tabBodyOdd: {
                    margin: [1, 2, 1, 2],
                },
                total: {
                    bold: true
                },
                debit: {
                    bold: true,
                    italics: true,
                    alignment: 'right'
                },
                credit: {
                    bold: true,
                    italics: true,
                    alignment: 'right'
                },
                client: {
                    alignment: 'left',
                    margin: [0, 4, 0, 0]
                },
                clientEnd: {
                    alignment: 'left',
                    margin: [0, 4, 0, 8]
                },
                clientCode: {
                    alignment: 'left',
                    margin: [0, 4, 0, 0],
                    fontSize: 10,
                    italics: true
                }
            }
        };
        let name: string = client.name.replace(/ /g, '');
        let pdf = pdfMake.createPdf(dd);
        //pdf.download(`releve-${name}.pdf`);
        pdf.getDataUrl((data) => {
            //console.log(err,data);
            if (data) {
                this.releveFrame.nativeElement.src = data;
            }
        });

    }

    private _formatAmount(value) {
        return numberWithSpaces(value);
    }
}
