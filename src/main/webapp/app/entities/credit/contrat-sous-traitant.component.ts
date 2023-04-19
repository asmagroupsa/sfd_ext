import {Component, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";
import {CreditService} from "./credit.service";
import {UserData} from "../../shared/index";

declare const pdfMake;
declare const qrGenerator;

@Component({
    selector: 'jhi-contrat-sous-traitant',
    templateUrl: './contrat-sous-traitant.component.html',
})
export class ContratSousTraitantComponent implements AfterViewInit {
    @ViewChild('iframe') private _iframe: ElementRef;
    loading = false;
    contratData: any;
    
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _creditService: CreditService,
        private _datePipe: DatePipe,
    ) {}


    async ngAfterViewInit() {
        this.loading = true;
        let data;
        
        const stId = +this._activatedRoute.snapshot.params.id;  
        const annee = new Date().getFullYear();
        const sfdName = UserData.getInstance().getSFD().name;

        try {
           
            data = await this._creditService.loanAgreementSt(stId, UserData.getInstance().getSFD().code);
        }
        catch (e) {
            console.error(e);
            this.loading = false;
            return;
        }       
        
        let qrCode;

        try {
            qrCode = await qrGenerator().toDataURL(
                JSON.stringify({
                    type: 'SFD',
                    reference: UserData.getInstance().getSFD().code,
                    //creditReference: data.reference,
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

        const stName = data.nom_sous_traitant;
        const dgName = data.nom_directeur_sfd;
        const taux = data.taux_commission;
        const adresse = data.adresse;
        const tel = data.telephone;

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
                                      body:[
                                      [
                                          {
                                              text: `REPUBLIQUE DU BENIN \n *************`,
                                              alignment: 'center',
                                              bold: true,
                                              fontSize: 28,
                                              margin: [0, 5],
                                          }
                                      ],
                                      [
                                          '\n\n\n\n\n\n\n\n\n\n\n'
                                      ],
                                      [
                                          {
                                              table:{
                                                  body:[
                                                      [
                                                          {
                                                              text: `CONTRAT D’AGREMENT DE SOUS-TRAITANT POUR LA COMPENSATION DES AGENTS MARCHANDS PAR (${sfdName})`,
                                                              alignment: 'center',
                                                              bold: true,
                                                              fontSize: 24,
                                                              margin: [0, 15],
                                                              fillColor: '#f9d8dd'
                                                          }    
                                                      ]    
                                                  ]
                                              }
                                          }
                                      ],
                                      [
                                          '\n\n\n\n\n\n\n'
                                      ],
                                      [
                                         {
                                             text:  `N°………../${sfdName}/PCA/DE/DM/Dd’EX/DAF/SP/${annee}`,
                                             alignment: 'center',
                                              bold: true,
                                              fontSize: 16,
                                              margin: [0, 5],
                                             
                                         }
                                      ],
                                      [
                                          '\n\n\n\n'
                                      ],
                                      [
                                         {
                                             text:  annee,
                                             alignment: 'center',
                                              bold: true,
                                              fontSize: 18,
                                              margin: [0, 5],
                                             
                                         }
                                      ],[
                                          '\n\n\n\n\n\n'
                                      ],
                                      
                                  ]
                                  },
                                  layout: 'noBorders',
                                  margin: [30, 20],
                              }   
                          ]
                      ]
                  },
                  pageBreak: 'after',
              }, 
              {
                  width: '*',
                  fontSize: 11,
                  alignment: 'justify',
                  margin: [20, 20],
                  lineHeight: 1.30,
                  stack: [
                    
                    {
                        text:  "\nEntre",
                        fontSize: 13,
                        margin: [0, 5],
                        
                    },
                      {
                          text:[
                              /* {
                                  text: `L’`,
                              }, */
                              {
                                  text: `${sfdName}`,
                                  bold: true
                              },
                              {
                                  text: `, agréée sous le numéro L.13.00.45.A, ayant son siège social au carré N°00227F, Maison LIAMIDI Rafiatou, Quartier Gbènan, 072BP327-Cotonou, Tél : (00229)21321127, représentée par son Directeur Exécutif, Monsieur dgName ci-dessous désigné ’’ASMAB’’,`
                              },
                          ]
                      },
                      {
                          text: `D’une part`,
                      },
                      {
                          text: `Et`,
                      }, 
                      {
                          text: `D’autre part `,
                      }, 
                      {
                          text:[
                              {
                                  text: `\nMonsieur / Madame ${stName},domicilié(e) à (quartier) ${adresse} Tél (00229) ${tel}, agissant pour propre compte, ci-dessous désigné (e) le`,
                              },{
                                  text: ` ’’Sous traitant’’ \n`,
                                  bold: true
                              },
                              {
                                  text: `ci-dessous collectivement désignés`,
                              },
                              {
                                  text: `’’Parties’’`,
                                  bold: true
                              },
                              {
                                  text: `, et individuellement `,
                              },
                              {
                                  text: `’’Partie’’ \n`,
                                  bold: true
                              },
                              {
                                  text: `Préalablement au présent acte, il est rappelé ce qui suit : \n `,
                              },
                          ]
                      },
                      {
                          text:'EXPOSE DES MOTIFS',
                          alignment: 'center',
                          bold: true,
                          decoration: 'underline',
                          decorationStyle: 'solid',
                          decorationColor: 'black'
                      },
                      {
                          text: `${sfdName} qui commercialise des produits financiers digitaux, dispose d’agences à travers le pays, et d’un réseau d’Agents Marchands. Pendant la journée, ces Agents Marchands sont amenés à se rendre   aux guichets des Agences pour se faire compenser les débours effectués, afin de se procurer de la liquidité. Mais ils opèrent souvent dans des zones éloignées des Agences.\n
                                  Pour leur éviter des ruptures de ressources et donc l’arrêt de leurs activités, ${sfdName} agrée des sous-traitants, personnes morales ou physiques, capables de répondre aux demandes de compensation des Agents Marchands.\n
                                  C’est dans ce cadre que le présent contrat d’agrément formalise le partenariat entre l’ASMAB et Monsieur /Madame ${stName}\n
                                  Il s’articule ainsi qu’il suit :
                                  `,
                      },
                      {
                          text:[
                              {
                                  text: `Article 1er :`,
                                  bold: true,
                                  decoration: 'underline',
                                  decorationStyle: 'solid',
                                  decorationColor: 'black'
                              },
                              {
                                  text: ` Objet`,
                                  bold: true
                              },
                          ]
                      },
                      {
                        text:`Le présent contrat d’agrément a pour objet de permettre aux Agents Marchands de se faire compenser à proximité de leurs lieux d’activités.`,  
                      }
                      ,{text:'\n'},
                      {
                          text:[
                              {
                                  text: `Article 2 :`,
                                  bold: true,
                                  decoration: 'underline',
                                  decorationStyle: 'solid',
                                  decorationColor: 'black'
                              },
                              {
                                  text: ` Obligations des parties`,
                                  bold: true
                              },
                          ]
                      },
                      {
                          text:[
                              
                              {
                                  text: `1-1 `,
                                  bold: true
                              },
                              {
                                  text: `Obligations d’ASMAB`,
                                  bold: true,
                                  decoration: 'underline',
                                  decorationStyle: 'solid',
                                  decorationColor: 'black'
                              },
                          ]
                      },
                      {
                          text:`Par les présentes, ${sfdName}, représentée par son Directeur Exécutif, s’engage : \n`,
                      },
                      {
                          text: `-	A prendre toutes les dispositions financières pour compenser tous les Agents Marchands qui se présenteront à lui pour se procurer de la liquidité;`,
                          margin: [30, 0, 0, 0],
                      },
                      {
                          text: `-	A compenser le sous-traitant aussitôt qu’il se présentera à l’un de ses guichets pour rentrer dans ses fonds.`,
                          margin: [30, 0, 0, 0],
                      },
                      {
                          text:[
                              
                              {
                                  text: `1-2 `,
                                  bold: true,
                              },
                              {
                                  text: `Obligations du Sous-Traitant`,
                                  bold: true,
                                  decoration: 'underline',
                                  decorationStyle: 'solid',
                                  decorationColor: 'black'
                              },
                          ]
                      },
                      {
                          text:`Aux termes des présentes, Monsieur / Madame ${stName}, sous-traitant (e), s’engage :  \n`,
                      },
                      {
                          text: `-	A prendre toutes les dispositions financières pour compenser tous les Agents Marchands qui se présenteront à lui pour se procurer de la liquidité;`,
                          margin: [30, 0, 0, 0],
                      },
                      {
                          text: `-	A tenir un état exhaustif des compensations effectuées au profit des Agents Marchands;`,
                          margin: [30, 0, 0, 0],
                      },
                      {
                          text: `-	A prévenir une demi-heure (30 minutes) avant, le Chef de l’agence où il veut se faire compenser. `,
                          margin: [30, 0, 0, 0],
                      },
                      {text:'\n'},
                      {
                          text:[
                              {
                                  text: `Article 3 :`,
                                  bold: true,
                                  decoration: 'underline',
                                  decorationStyle: 'solid',
                                  decorationColor: 'black'
                              },
                              {
                                  text: ` Rémunération`,
                                  bold: true
                              },
                          ]
                      },
                      {
                        text:`${sfdName} s’engage à payer au titre de commission au sous-traitant, la somme de ${taux}% sur toute opération effectuée à un agent sur toute l’étendue du territoire dans le cadre de son activité.`,  
                      },
                      {text:'\n'},
                      {
                          text:[
                              {
                                  text: `Article 4 :`,
                                  bold: true,
                                  decoration: 'underline',
                                  decorationStyle: 'solid',
                                  decorationColor: 'black'
                              },
                              {
                                  text: ` Règlement des litiges`,
                                  bold: true
                              },
                          ]
                      },
                      {
                        text:`Les deux parties conviennent de régler à l’amiable, tout différend qui naîtrait de la mise en œuvre du présent contrat d’agrément.
                          \n En cas d’échec de la voie amiable de règlement du litige, la juridiction compétente sera habilitée à connaître des faits.`,  
                      },
                      {text:'\n'},
                      {
                          text:[
                              {
                                  text: `Article 5 :`,
                                  bold: true,
                                  decoration: 'underline',
                                  decorationStyle: 'solid',
                                  decorationColor: 'black'
                              },
                              {
                                  text: ` Election de domicile`,
                                  bold: true
                              },
                          ]
                      },
                      {
                        text:`Pour l’exécution du présent contrat d’agrément, les Parties élisent domicile, chacune à son adresse ci-dessus indiquée.`,  
                      },
                      {text:'\n'},
                      {
                          text:[
                              {
                                  text: `Article 6 :`,
                                  bold: true,
                                  decoration: 'underline',
                                  decorationStyle: 'solid',
                                  decorationColor: 'black'
                              },
                              {
                                  text: ` Durée et entrée en vigueur`,
                                  bold: true
                              },
                          ]
                      },
                      {
                        text:`Le présent contrat d’agrément établi pour une durée de deux (02) ans renouvelable, prend effet dès sa signature par les deux parties.`,  
                      },
                      {text:'\n\n'},
                      {text:'Fait en trois (03) exemplaires originaux,', alignment: 'right',},
                      {text:`A Cotonou, le ${this._datePipe.transform(new Date(), 'mediumDate')}`, alignment: 'right',},
                      {text:'\nONT SIGNE',  alignment: 'center'},
                       {text:'\n\n'},
                      {
                          columns: [
                              {
                                 text:[
                                      {
                                        
                                          text: `Pour ${sfdName}\nLe Directeur Exécutif`,
                                          bold: true,
                                          alignment: 'center',
                                          decoration: 'underline',
                                          decorationStyle: 'solid',
                                          decorationColor: 'black',  
                                      },{
                                          text:'\n\n\n\n\n'+dgName, alignment: 'center',
                                      }   
                                  ],
                                   width: 'auto',
                              },
                              {
                                    width: '*',
                                    alignment: 'center',
                                    stack: [
                                        (() => qrCode ? {image: qrCode, width: 100} : {text: ''})()
                                    ],
                                },
                              {
                                  text:[
                                      {
                                        
                                          text: 'Pour le Sous-Traitant\nMonsieur / Madame',
                                          bold: true,
                                          alignment: 'center',
                                          decoration: 'underline',
                                          decorationStyle: 'solid',
                                          decorationColor: 'black',  
                                      },{
                                          text:`\n\n\n\n\n${stName}`, alignment: 'center',
                                      }   
                                  ],
                                   width: 'auto',
                              },
                          ],
                      },
                  ],
              }  
            ],
              footer: function (currentPage, pageCount) {
                      return {
                          //margin: [100, -50, 20, 180],
                          margin: [40, 0, 75, 0],
                          alignment: 'right',
                          text: currentPage + ' / ' + pageCount,
                          
                      }
                      
                  } 
          };

        pdfMake.createPdf(dd)
        .getDataUrl((data) => {
            this._iframe.nativeElement.src = data;
        });
    }
}
