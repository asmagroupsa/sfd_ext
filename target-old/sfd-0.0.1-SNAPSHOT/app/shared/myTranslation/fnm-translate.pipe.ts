import { Pipe, PipeTransform } from '@angular/core';
import { LanguesService } from './langues';

@Pipe({ name: 'fnmtranslate' })
export class FnmTranslatePipe implements PipeTransform {
    constructor(private langues: LanguesService) {}

    transform(jhiAsmabTranslate: string, lang: string) {
        return new Promise(resolve => {
            if (this.langues.getLang() == 'en') {
                this.langues.getEnglish().subscribe(res => {
                    let split = jhiAsmabTranslate.split('.');
                    if (split[split.length - 1].indexOf('placeholder') != -1) {
                        split[split.length - 2] =
                            split[split.length - 2] +
                            '.' +
                            split[split.length - 1];
                        split.pop();
                    }
                    let value: any;
                    split.forEach((curr, i) => {
                        value = i ? value[curr] : res[curr];
                    });
                    resolve(value);
                });
            } else {
                this.langues.getFrench().subscribe(res => {
                    let split = jhiAsmabTranslate.split('.');
                    if (split[split.length - 1].indexOf('placeholder') != -1) {
                        split[split.length - 2] =
                            split[split.length - 2] +
                            '.' +
                            split[split.length - 1];
                        split.pop();
                    }
                    let value: any;
                    split.forEach((curr, i) => {
                        if (!value && i) return;
                        value = i ? value[curr] : res[curr];
                    });
                    resolve(value);
                });
            }
        });
    }
}
