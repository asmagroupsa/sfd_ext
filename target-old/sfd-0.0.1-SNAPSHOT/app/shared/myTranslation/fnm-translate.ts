import {
    Component,
    Input,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    NgZone
} from '@angular/core';
import { LanguesService } from './langues';
import { Subscription } from 'rxjs';

@Component({
    selector: '[jhiFnmTranslate]',
    template: `<ng-template #elseBlock>
        {{value}}
    </ng-template>
    <span [innerHTML]="value" *ngIf="!jhiFnmTranslateTag;else elseBlock"></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class jhiFnmTranslateComponent {
    result: Subscription;
    value: any = '';
    @Input() jhiFnmTranslateTag: boolean = false;
    @Input() jhiFnmTranslate: string = '';
    @Input() translateValues: any = '';
    constructor(
        private language: LanguesService,
        private changeDetectorRef: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngAfterContentInit() {
        this.ngZone.runOutsideAngular(() => {
            this.initializeLang();
        });
        this.result = this.language.langState.subscribe(res => {
            this.ngZone.runOutsideAngular(() => {
                this.initializeLang();
            });
        });
    }
    ngOnDestroy() {
        if (this.result) this.result.unsubscribe();
    }
    initializeLang() {
        this.language.getTranslations().subscribe(
            json => {
                if (this.jhiFnmTranslate.indexOf('.') == -1) {
                    this.ngZone.run(() => {
                        this.value = this.jhiFnmTranslate;
                        this.changeDetectorRef.markForCheck();
                    });
                    return;
                }
                let split = this.jhiFnmTranslate.split('.');
                let value: any;
                split.forEach((curr, i) => {
                    if (!value && i) return;
                    value = i ? value[curr] : json[curr];
                });

                if (this.translateValues) {
                    let start = this.translateValues.indexOf("'");
                    let end = this.translateValues.lastIndexOf("'");
                    let id;
                    if (start != -1 && end != -1)
                        id = this.translateValues.slice(start + 1, end);
                    else id = eval(this.translateValues);
                    value = value ? value + '' : '';
                    value = value.replace(/\{\{.*\}\}/, id);
                }
                this.ngZone.run(() => {
                    this.value = value || this.jhiFnmTranslate;
                    this.changeDetectorRef.markForCheck();
                });
            },
            err => {
                this.ngZone.run(() => {
                    this.value = this.jhiFnmTranslate;
                    this.changeDetectorRef.markForCheck();
                });
            }
        );
    }
}
