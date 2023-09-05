import {
  Component,
  Injectable,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  AfterViewInit,
  forwardRef
} from '@angular/core';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  NgbDateParserFormatter,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { LanguesService } from './langues';
export function factory() {
  return new NgbDateMomentParserFormatter('DD-MM-YYYY');
}
const I18N_VALUES = {
  fr: {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Aou',
      'Sep',
      'Oct',
      'Nov',
      'Déc'
    ]
  },
  en: {
    weekdays: ['Mon', 'Tue', 'Wedn', 'Thirs', 'Fri', 'Sat', 'Sun'],
    months: [
      'Jan',
      'Feb',
      'Mar',
      'Apri',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
  }
  //
};

// Definir le service de langue.
// possible d'utiliser la valeur de Angular LOCALE_ID
@Injectable()
export class I18n {
  language = 'fr';
  constructor(private languesService: LanguesService) {
    languesService.langState.subscribe((lang: string) => {
      this.language = lang;
    });
  }
}
export function fact() {
  return new NgbDateMomentParserFormatter('DD-MM-YYYY');
}
// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbdDatepickerI18n),
  multi: true
};
const noop = () => {};
@Component({
  selector: 'ngbd-datepicker-i18n',
  templateUrl: './date-picker-i18n.html',
  styles: [
    `
    .desactive{
       pointer-events: none;
    }
    
    input.picker{
    border: none;
    border-bottom: 1px solid #9e9e9e;
    border-radius: 0px;
  }
  `
  ],
  providers: [
    I18n,
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    {
      provide: NgbDateParserFormatter,

      useFactory: factory
    }
  ] // define custom NgbDatepickerI18n provider
})
export class NgbdDatepickerI18n implements AfterViewInit, ControlValueAccessor {
  model: any;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  _minDate = { year: 1915, month: 1, day: 1 };
  @Input()
  get minDate() {
    return this._minDate;
  }
  set minDate(date: any) {
    if (date) {
      if (date.year) {
        this._minDate = {
          year: date.year,
          month: date.month,
          day: date.day
        };
      } else {
        const minDate = new Date;

        this._minDate = {
          year: minDate.getFullYear(),
          month: minDate.getMonth() + 1,
          day: minDate.getDate()
        };
      }
    }
  }

  _maxDate = {year: 9998, month: 1, day: 1};

  @Input()
  get maxDate() {
    return this._maxDate;
  }

  set maxDate(date: any) {
    this._maxDate = {
      year: date.year,
      month: date.month,
      day: date.day
    };
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  writeValue(value: any): void {
    if (value == undefined) {
      /* this.model = {
         year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate() 
      }; */
      this.onChangeCallback(this.model);
    } else if (value !== this.model) {
      this.model = value;
    }
  }
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  //set accessor including call the onchange callback
  change(v: any) {
    if (v !== this.model) {
      this.model = v;
      this.onChangeCallback(v);
    }
  }
  ngAfterViewInit() {}
}

export class NgbDateMomentParserFormatter extends NgbDateParserFormatter {
  constructor(private momentFormat: string) {
    super();
  }
  format(date: NgbDateStruct): string {
    if (date === null) {
      return '';
    }
    let d = moment({
      year: date.year,
      month: date.month - 1,
      date: date.day
    });
    return d.isValid() ? d.format(this.momentFormat) : '';
  }

  parse(value: string): NgbDateStruct {
    if (!value) {
      return null;
    }
    let d = moment(value, this.momentFormat);
    return d.isValid()
      ? {
          year: d.year(),
          month: d.month() + 1,
          day: d.date()
        }
      : null;
  }
}
