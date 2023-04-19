import {
    Directive,
    HostListener,
    Input,
    Output,
    ElementRef,
    EventEmitter,
    OnInit,
    ViewContainerRef
} from '@angular/core';
import {
    numberToLocalString,
    numberToLocalStringTonumber
} from './functions';

@Directive({selector: '[formatNumberMyMiller]'})
export class FormatNumberByMillerDirective {
    @Output() formatNumberMyMiller: EventEmitter<number> = new EventEmitter();

    constructor(
        private _elementRef: ElementRef,
        private _viewContainerRef: ViewContainerRef
    ) {
        if (this._elementRef.nativeElement.type !== 'text') {
            this._elementRef.nativeElement.type = 'text';
        }
    }

    @HostListener('ngModelChange')
    ngModelChange() {
        this._elementRef.nativeElement.value = numberToLocalString(this._elementRef.nativeElement.value);
        this.formatNumberMyMiller.emit(numberToLocalStringTonumber(this._elementRef.nativeElement.value));
    }

    @HostListener('keydown', ['$event.key'])
    onkeydown(key) {
        return ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'ArrowLeft', 'ArrowRight'].indexOf(key) !== -1;
    }
}
