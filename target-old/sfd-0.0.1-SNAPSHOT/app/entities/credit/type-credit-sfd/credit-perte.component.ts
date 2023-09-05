import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  JhiEventManager,
  JhiParseLinks,
  JhiPaginationUtil,
  JhiLanguageService,
  JhiAlertService
} from 'ng-jhipster';

import { CreditService } from '../credit.service';
import { Credit } from '../credit.model';
import { PaginationConfig } from '../../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../../shared/myTranslation/langues';
import { Principal, ResponseWrapper, UserData } from '../../../shared';
@Component({
  selector: 'jhi-credit-perte',
  templateUrl: './credit-perte.component.html',
  styleUrls: ['../../../shared/state/state.scss']
})
export class CreditPerteComponent {
  credits: any[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  date: any;

  constructor(
      private creditService: CreditService,
      private parseLinks: JhiParseLinks,
      private alertService: JhiAlertService,
      public principal: Principal,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private eventManager: JhiEventManager,
      private paginationUtil: JhiPaginationUtil,
      private paginationConfig: PaginationConfig,
      public langue: LanguesService
  ) {
  }
  onDateChange(ev: any) {
      this.date = ev;
      if (this.date) {
          let date: string = `${this.date.year}/${this.date.month}/${this.date.day}`;
          this.credits = [];
          this.loadAll(date);
      }
  }
  loadAll(date?: string) {
    let sfd_id = UserData.getInstance().sfdId;
    console.log('sfd_id' + sfd_id);

      let d = new Date();
      date = date || `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`;
      this.creditService
          //.getPerteCreditListBySFD(sfd_id)
          .getPerteCreditListBySFD(0)
          .subscribe(
              (res: any) => {
                console.log(res);
                this.credits = res.filter(function( element ) {
                    console.log(element);
                    return element !== undefined;
                 });
                //console.log(res.json);
                //this.credits = res.json;
                console.log(this.credits);
                //this.onSuccess(res.json, res.headers)
              },
              //(res: ResponseWrapper) => this.onError(res.json)
          );
  }

  ngOnInit() {
      this.loadAll();
      this.registerChangeInCredits();
  }

  ngOnDestroy() {
      if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }
s
  trackId(index: number, item: Credit) {
      return item.id;
  }
  registerChangeInCredits() {
      this.eventSubscriber = this.eventManager.subscribe(
          'creditListModification',
          response => this.loadAll()
      );
  }

  private onSuccess(data, headers) {
    console.log('onSuccess -> ok');
      this.credits = data;
      console.log(this.credits);
  }
  private onError(error) {
      //this.alertService.error(error.message, null, null);
  }
}
