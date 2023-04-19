import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { NotificationClient } from './notification-client.model';
import { NotificationClientService } from './notification-client.service';
declare let collapsible: any;

@Component({
  selector: 'jhi-notification-client-detail',
  templateUrl: './notification-client-detail.component.html'
})
export class NotificationClientDetailComponent implements OnInit, OnDestroy {
  nomClient: string;
  notificationClient: NotificationClient;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(
    private eventManager: JhiEventManager,
    private notificationClientService: NotificationClientService,
    private route: ActivatedRoute
  ) { }
  ngAfterViewInit() {
    setTimeout(() => {
      collapsible();
    }, 1500);
  }
  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.route.fragment.subscribe(fragment => {
      this.nomClient = fragment;
    });
    this.registerChangeInNotificationClients();
  }

  load(id) {
    this.notificationClientService.find(id).subscribe(notificationClient => {
      this.notificationClient = notificationClient;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInNotificationClients() {
    this.eventSubscriber = this.eventManager.subscribe(
      'notificationClientListModification',
      response => this.load(this.notificationClient.id)
    );
  }
}
