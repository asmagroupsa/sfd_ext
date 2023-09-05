
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "typeClient" })

export class TypeClientPipe implements PipeTransform {
    transform(typeClients: any[]) {
        if (!typeClients) return [];
        return typeClients.filter((type: any) => {
            return true;
            //return charge.userReference != chargedepret;
        });
    }
}