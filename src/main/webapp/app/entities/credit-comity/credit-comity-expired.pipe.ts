import { Pipe, PipeTransform } from '@angular/core';
import { CreditComity } from './credit-comity.model';

@Pipe({ name: 'creditComityExpired' })
export class CreditComityExpiredPipe implements PipeTransform {
    transform(creditComities: CreditComity[], expired = false, filter = true): CreditComity[] {
        if (!filter || !creditComities) {
            return creditComities || creditComities;
        }

        const now: Date = new Date();
        return creditComities.filter((creditComity: CreditComity): boolean => {
            let selected: boolean = isSameDate(now, creditComity.endDate);

            if (!selected) {
                selected = now < creditComity.endDate;
            }
            return expired ? !selected : selected;
        });
    }
}

function isSameDate(date1: Date, date2: Date): boolean {
    return (
        date1.getDay() === date2.getDay() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}
