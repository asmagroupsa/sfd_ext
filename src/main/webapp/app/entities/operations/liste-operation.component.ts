import { Component, OnInit, OnDestroy } from '@angular/core';

import { Operation } from './operation.model';

import { Client } from '../client/client.model';
import { ClientService } from '../client/client.service';
import { ResponseWrapper } from '../../shared';
import { OperationComptableService } from '../operation-comptable/operation-comptable.service';
declare let select_init: any;
declare let clearDropdown: any;

@Component({
  selector: 'jhi-liste-operation',
  templateUrl: './liste-operation.component.html'
})
export class ListeOperationComponent implements OnInit, OnDestroy {
  operations: any[] = [];
  clients: Client[] = [];
  currentClient: any;
  currentCompte: any;
  accounts: any[] = [];
    currentSearch: string;
  constructor(
    private clientService: ClientService,
    private operationService: OperationComptableService
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  clear() {
        this.currentSearch = '';
    }
  onClientChange() {
    this.operations = [];
    clearDropdown('.compte .ui.fluid.search.dropdown');
    this.currentCompte = '';
    if (this.currentClient && this.currentClient.comptes)
      this.accounts = this.currentClient.comptes || [];
  }

  totaldebitCredit(debit: boolean = true) {
    let total = 0;
    if (!this.operations.length) return total;
    this.operations.forEach(operation => {
      total += debit ? operation.debit : operation.credit;
    });
    return total;
  }
  onCompteChange() {
    if(!this.currentCompte) return ;
    this.operations = [];
    this.operationService.listeOperations(this.currentCompte).subscribe(
      (res: ResponseWrapper) => {
        this.operations = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }
  loadAll() {
    this.clientService
      .query({
        size: 1000
      })
      .subscribe(
        (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
        (res: ResponseWrapper) => this.onError(res.json)
      );
  }
  ngOnInit() {
    this.loadAll();
  }

  ngOnDestroy() {}

  private onSuccess(data, headers) {
    this.clients = data;
  }
  private onError(error) {}
}
